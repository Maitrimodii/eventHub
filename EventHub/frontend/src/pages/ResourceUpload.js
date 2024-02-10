import { useEffect, useRef, useState } from "react";
import { TiDropbox } from "react-icons/ti";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import axios from "axios";

export default function ResourceUpload() {
  const [project, setProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null)

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
        const response = await axios.get('/api/event/myEvent', config);
        setProject(response.data.events);
        console.log(response.data.events);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('change', handleFileChange);
    }
  }, [inputRef]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setFiles([...files, ...droppedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("projectName", selectedProject);
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const result = await axios.post('/api/file/uploadFile', formData, config);
      console.log("result-->", result);

      if (result.statusText === "OK") {
        toast.success("Uploaded Successfully!");
      } else if (result.success === false) {
        toast.error("Please try again to upload!");
      }
    } catch (error) {
      toast.error("Error uploading file");
      console.error('Error uploading file:', error);
    }
  };

  const containerClickHandler = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="container mx-auto p-8">
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">File Uploads:</h1>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Select Project</label>
            <div className="mt-1">
              {project && project.length > 0 ? (
                <select
                  name="taskProject"
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
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
                <p className="text-red-500">Sorry, No Project</p>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={containerClickHandler}
            className="border-dashed border-2 border-gray-300 p-8 mt-4 cursor-pointer flex flex-col items-center justify-center"
          >
            <div className="text-center">
              <h1 className="text-xl font-semibold mb-4">Drag & Drop or Click anywhere to upload</h1>

              {files && files.length > 0 ? (
                <div>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index} className="mb-2">📄 {file.name}</li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <p className="text-lg font-semibold">Total : {files.length}</p>
                  </div>
                </div>
              ) : (
                <>
                <div className="flex items-center justify-center mb-4">
                    <TiDropbox className="text-4xl" />
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    ref={inputRef}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {files && files.length > 0 ? (
              <>
                <div className="mt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    Upload
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-4">
                  <p className="text-red-500">Please select Project</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    );
}
