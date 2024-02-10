const asyncHandler = require('express-async-handler');
const Event = require('../models/EventModel');

// @desc get all events
// @route GET/ api/event/all-events
// @access Private
const getEvents = asyncHandler(async (req, res, next) => {
    try {
      const { location, category, page, pageSize, keyWordSearch, sort } = req.query;
  
      const filterObject = {};
  
      if (location) {
        filterObject.location = { $regex: new RegExp(location, 'i') };
      }
      if (category) {
        filterObject.category = { $regex: new RegExp(category, 'i') };
      }
  
      // Apply filters
      let filterEvents = await Event.find(filterObject).populate('organizer', 'name')
  
      // Apply keyword search
      if (keyWordSearch) {
        const keywordSearchRegex = new RegExp(keyWordSearch, 'i');
      
        filterEvents = filterEvents.filter((event) => (
          event.title.match(keywordSearchRegex) ||
          event.description.match(keywordSearchRegex) ||
          event.location.match(keywordSearchRegex)
        ));
      }
  
      // Apply sorting
      const sortedEvents = filterEvents.sort((a, b) => {
        if (sort === 'oldest') {
          return a.createdAt - b.createdAt;
        } else if (sort === 'newest') {
          return b.createdAt - a.createdAt;
        }
        return 0;
      });
  
      // Apply Pagination
      const pages = Number(page) || 1;
      const limit = Number(pageSize) || 10;
      const startIndex = (pages - 1) * limit;
      const endIndex = pages * limit;
  
      const paginatedEvents = sortedEvents.slice(startIndex, endIndex);
  
      res.status(200).json({events: paginatedEvents });
    } catch (error) {
      next(error);
    }
});

//@desc get Event details
//@route GET/ api/event/get-event/:eventId
//@access Private
const getEventDetails = asyncHandler(async (req, res, next) => {
  try{
    const { eventId } = req.params;
    
    console.log(eventId);
   
    const event = await Event.findOne({_id:eventId});
    
    console.log("event", event);
    res.status(200).json({event});

  } catch(error){
    next(error);
  }
})

//@desc post an event
//@route POST/ api/event/create-event
//@access Private
const createEvent = asyncHandler(async (req, res, next) => {
    try{
        const { title, description, category, location, days, fees, applyBy } = req.body;
        const userId = req.user._id;
        
        const event = await Event.create({
            title,
            description,
            category,
            location,
            days,
            organizer: userId,
            fees,
            applyBy,
        });
        
        res.status(200).json({event});
        console.log({event});
    }catch(error){
        next(error);
    }
})

//@desc update event details
//@route PUT /api/event/update-event
//@access Private
const updateEvent = asyncHandler(async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Invalid organizer" });
    }

    Object.assign(event, req.body);

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch(error){
    next(error);
  }
})

const deleteEvent = asyncHandler(async (req, res, next) => {
  try {
    const eventId = req.params.eventId; 
    
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
  } catch (error) {
    next(error);
  }
});

//@desc get events created by organiser
//@route GET/ api/event/myEvent
//@access Private
const getMyEvents = asyncHandler(async (req, res, next) => {
  try{
    const { location, category, page, pageSize, keyWordSearch, sort } = req.query;
  
    const organizer = req.user._id;

    // console.log(organizer);
    const filterObject = {};
  
    filterObject.organizer = organizer;

    if (location) {
      filterObject.location = { $regex: new RegExp(location, 'i') };
    }
    if (category) {
      filterObject.category = { $regex: new RegExp(category, 'i') };
    }
    
    // Apply filters
    let filterEvents = await Event.find(filterObject).populate('organizer', 'name')
    
    if (keyWordSearch) {
      const keywordSearchRegex = new RegExp(keyWordSearch, 'i');
    
      filterEvents = filterEvents.filter((event) => (
        event.title.match(keywordSearchRegex) ||
        event.description.match(keywordSearchRegex) ||
        event.location.match(keywordSearchRegex)
      ));
    }

    // Apply sorting
    const sortedEvents = filterEvents.sort((a, b) => {
      if (sort === 'oldest') {
        return a.createdAt - b.createdAt;
      } else if (sort === 'newest') {
        return b.createdAt - a.createdAt;
      }
      return 0;
    });

    // Apply Pagination
    const pages = Number(page) || 1;
    const limit = Number(pageSize) || 10;
    const startIndex = (pages - 1) * limit;
    const endIndex = pages * limit;

    const paginatedEvents = sortedEvents.slice(startIndex, endIndex);

    res.status(200).json({events: paginatedEvents });

  } catch(error){
    next(error);
  }
})

// @desc Get participants for a specific event
// @route GET /api/event/participants/:eventId
// @access Public (you can change this based on your authentication requirements)
const getParticipants = asyncHandler(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const eventWithParticipants = await Event.findById(eventId)
      .populate({
        path: 'participants',
        model: 'Attendee',
        select: 'name email contactNo attendance',
      })
      .exec();

    if (!eventWithParticipants) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({days: eventWithParticipants.days.length, participants: eventWithParticipants.participants });
  } catch (error) {
    next(error);
  }
});

module.exports = { createEvent, getEvents, getEventDetails ,getMyEvents, getParticipants, updateEvent, deleteEvent }