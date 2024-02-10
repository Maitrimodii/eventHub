import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { FaDownload } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import axios from "axios";

export default function ViewResources() {
  const [project, setProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [listFiles, setListFiles] = useState([]);
  const userLogin = useSelector((state) => (state.userLogin));
  const userInfo = userLogin.userInfo;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const fetchData = async () => {
      try {
        if (userInfo.role === "organiser") {
          const response = await axios.get('/api/event/myEvent', config);
          setProject(response.data.events);
        } else if (userInfo.role === "attendee") {
          const response = await axios.get('/api/registerdEvents', config);
          setProject(response.data.myEvents);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const listAllFiles = async (selectedProject) => {
    setListFiles(null);
    setSelectedProject(selectedProject);
    try {
      const responseData = await axios.get(`api/file/listFiles/${selectedProject}`, config);
      setListFiles(responseData.data.filedata.projectInfo.files);
    } catch (error) {
      console.log("Project file listing error ! ", error);
    }
  }

  const handleDelete = async (fileName) => {
    try {
      const fileToDelete = await axios.delete(`api/file/deleteFile/${selectedProject}/${fileName}`, config);

      if (fileToDelete.data.success === true) {
        toast.success("File Deleted successfully !");
      } else {
        toast.error("Some error occurred, Please try again !");
      }
    } catch (error) {
      toast.error("Some error occurred, please try again !");
      console.log("File deleting error");
    }
  }

  return (
    <div className="container mx-auto p-4 mt-6 md:w-1/2 shadow-lg rounded-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">File Details</h1>
        <div className="flex items-center space-x-4">
          <label className="text-lg">Select Project:</label>
          {project && project.length > 0 ? (
            <select
             className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              name="taskProject"
              onChange={(e) => listAllFiles(e.target.value)}
            >
              <option> -- Choose Project --</option>
              {project.map((project) => (
                <option
                  value={project._id}
                  key={project._id}
                >
                  {project.title}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-red-500">No Project</span>
          )}
        </div>
      </div>

      {listFiles && listFiles.length > 0 ? (
        <div>
          {listFiles.map((file) => (
            <div key={file._id} className="shadow-md p-4 mb-4 transition duration-300 hover:shadow-xl  rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{file.fileName}</span>
                <div className="flex items-center space-x-2">
                  <Link to={file.fileUrl}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-600">
                      <FaDownload />
                    </button>
                  </Link>
                  {userInfo.role === "organiser" && (
                    <button
                      onClick={() => handleDelete(file.fileName)}
                      className="bg-red-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-red-600"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <span className="text-gray-500">No File Found or Please Select Project!</span>
        </div>
      )}
    </div>
    );
}
