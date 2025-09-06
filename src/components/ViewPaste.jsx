import { Copy, Share, Calendar, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ViewPaste = () => {
  const { id } = useParams();
  const pastes = useSelector((state) => state.paste.pastes);
  const paste = pastes.filter((paste) => paste._id === id)[0];

  const handleShare = async () => {
    const shareData = {
      title: paste?.title,
      text: paste?.content,
      url: window.location.href
};

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error("Failed to share");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard! You can now share it on social media.");
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error("Failed to copy link");
      }
    }
  };

  if (!paste) {
    return (
      <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-500 mb-2">Paste Not Found</h1>
          <p className="text-gray-400 mb-6">The paste you're looking for doesn't exist or has been deleted.</p>
          <a
            href="/pastes"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Pastes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center space-x-3">
            <button
              className="p-3 rounded-xl bg-purple-50 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 group transition-all duration-300 transform hover:scale-105"
              title="Share paste"
              onClick={handleShare}
            >
              <Share className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
            </button>
            
            <button
              className="p-3 rounded-xl bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 group transition-all duration-300 transform hover:scale-105"
              title="Copy content"
              onClick={() => {
                navigator.clipboard.writeText(paste.content);
                toast.success("Copied to Clipboard");
              }}
            >
              <Copy className="w-5 h-5 text-green-600 group-hover:text-green-700" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{paste.title}</h1>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(paste.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{paste.content?.length || 0} characters</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="border-2 border-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden mt-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">View Mode</span>
            </div>
          </div>
          
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-gray-800 leading-relaxed text-sm bg-gray-50 p-6 rounded-xl border">
              {paste.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPaste;