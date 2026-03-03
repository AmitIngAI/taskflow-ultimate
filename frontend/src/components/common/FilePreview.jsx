import { FileText, Image as ImageIcon, Download, Trash2, File } from 'lucide-react';
import { formatBytes } from '../../utils/helpers';

const FilePreview = ({ attachments = [], onDelete, canDelete = true }) => {
  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return ImageIcon;
    if (type?.includes('pdf')) return FileText;
    return File;
  };

  if (!attachments || attachments.length === 0) {
    return <p className="text-sm text-gray-500">No attachments</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {attachments.map((file, idx) => {
        const Icon = getFileIcon(file.type);
        
        return (
          <div
            key={idx}
            className="border border-gray-200 dark:border-dark-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatBytes(file.size)}
                </p>
              </div>
              
              <div className="flex gap-1">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-gray-200 dark:hover:bg-dark-600 rounded"
                >
                  <Download className="w-4 h-4" />
                </a>
                {canDelete && onDelete && (
                  <button
                    onClick={() => onDelete(file._id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilePreview;