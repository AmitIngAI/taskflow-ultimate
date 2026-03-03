import { useState } from 'react';
import { Upload, X, FileText, Image, File, Loader2 } from 'lucide-react';
import { Button } from './common';
import toast from 'react-hot-toast';
import axios from 'axios';

const FileUpload = ({ taskId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('auth-storage');
      const parsedToken = JSON.parse(token)?.state?.token;

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/attachments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${parsedToken}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        }
      );

      toast.success('File uploaded successfully!');
      onUploadSuccess(data.data);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Attachments
      </label>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragActive 
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
            : "border-gray-300 dark:border-dark-600 hover:border-primary-500",
          uploading && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
          accept="image/*,.pdf,.doc,.docx"
        />
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {uploading ? (
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400 mb-3" />
          )}
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, PDF, DOC up to 10MB
          </p>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;