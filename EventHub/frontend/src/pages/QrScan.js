import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useZxing } from "react-zxing";

const QrScan = () => {
  const [encryptedData, setEncryptedData] = useState('');
  const [isScanning, setScanning] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      setEncryptedData(result.getText());
      setScanning(false);
    },
  });

  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin.userInfo;

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const handleScan = () => {
    setEncryptedData('');
    setScanning(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/scanQr', { encryptedData }, config);
      console.log('Successful creation:', response.data);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }

  return (
    <div className="container mx-auto mt-10">
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl min-w-2xl shadow-lg border mb-6 ">
      <div className="mb-8 relative">
        <video className="w-full" ref={ref} />
        {isScanning && (
          <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
            <div className="border-4 border-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      <div className="text-center">
        {/* <div className="flex justify-between"> */}
        <button
          className={`bg-blue-500 text-white py-2 px-4 rounded mr-4 ${isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? 'Scanning...' : 'Scan QR Code'}
        </button>
        {encryptedData && (
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Mark Attendance
          </button>
        
        )}
        {/* </div> */}
      </div>
    </div>
    </div>
  );
};

export default QrScan;
