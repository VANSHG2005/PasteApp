import { Calendar, Copy, Eye, PencilLine, Trash2, Share } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react"; 
import { removeFromPastes } from "../redux/pasteSlice";
import { FormatDate } from "../utlis/formatDate";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const currentUser = useSelector((state) => state.paste.currentUser);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
  };

  const handleShare = async (paste) => {
    const shareData = {
      title: paste.title,
      text: paste.content,
      url: `${window.location.origin}/pastes/${paste._id}`
    };

    // Check if Web Share API is supported
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
      // Fallback: Copy to clipboard and show social media options
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard! You can now share it on social media.");
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error("Failed to copy link");
      }
    }
  };

  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Pastes</h1>
          <p className="text-gray-600">Manage and organize all your saved pastes</p>
        </div>

        {/* Search */}
        <div className="w-full flex gap-3 px-6 py-4 rounded-xl border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mt-6">
          <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search your pastes by title or content..."
            className="focus:outline-none w-full bg-transparent text-gray-700 placeholder-gray-400"
            value={searchTerm}  
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* All Pastes */}
        <div className="flex flex-col border-2 border-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              All Pastes ({filteredPastes.length})
            </h2>
          </div>
          <div className="w-full px-6 pt-6 flex flex-col gap-y-6">
            {filteredPastes.length > 0 ? (
              filteredPastes.map((paste, index) => (
                <div
                  key={paste?._id}
                  className={`border-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white w-full gap-y-6 justify-between flex flex-col sm:flex-row p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200 ${
                    index === filteredPastes.length - 1 ? 'mb-20' : ''
                  }`}
                >
                  {/* heading and Description */}
                  <div className="w-[50%] flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <p className="text-2xl font-bold text-gray-800">{paste?.title}</p>
                    </div>
                    <p className="text-sm font-normal line-clamp-3 max-w-[90%] text-gray-600 leading-relaxed">
                      {paste?.content}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{FormatDate(paste?.createdAt)}</span>
                      </span>
                      <span>{paste?.content?.length || 0} characters</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-y-4 sm:items-end">
                    <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                      {/* Only show edit button if user owns the paste */}
                      {(paste?.owner === currentUser || !paste?.owner) && (
                        <button
                          className="p-3 rounded-xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 group transition-all duration-300 transform hover:scale-105"
                          title="Edit paste"
                        >
                          <a href={`/?pasteId=${paste?._id}`}>
                            <PencilLine
                              className="text-blue-600 group-hover:text-blue-700"
                              size={20}
                            />
                          </a>
                        </button>
                      )}
                      
                      <button
                        className="p-3 rounded-xl bg-orange-50 border-2 border-orange-200 hover:bg-orange-100 hover:border-orange-300 group transition-all duration-300 transform hover:scale-105"
                        title="View paste"
                      >
                        <a href={`/pastes/${paste?._id}`} target="_blank">
                          <Eye
                            className="text-orange-600 group-hover:text-orange-700"
                            size={20}
                          />
                        </a>
                      </button>
                      
                      <button
                        className="p-3 rounded-xl bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 group transition-all duration-300 transform hover:scale-105"
                        title="Copy content"
                        onClick={() => {
                          navigator.clipboard.writeText(paste?.content);
                          toast.success("Copied to Clipboard");
                        }}
                      >
                        <Copy
                          className="text-green-600 group-hover:text-green-700"
                          size={20}
                        />
                      </button>
                      
                      <button
                        className="p-3 rounded-xl bg-purple-50 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 group transition-all duration-300 transform hover:scale-105"
                        title="Share paste"
                        onClick={() => handleShare(paste)}
                      >
                        <Share
                          className="text-purple-600 group-hover:text-purple-700"
                          size={20}
                        />
                      </button>
                      
                      {/* Only show delete button if user owns the paste */}
                      {(paste?.owner === currentUser || !paste?.owner) && (
                        <button
                          className="p-3 rounded-xl bg-red-50 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 group transition-all duration-300 transform hover:scale-105"
                          title="Delete paste"
                          onClick={() => handleDelete(paste?._id)}
                        >
                          <Trash2
                            className="text-red-600 group-hover:text-red-700"
                            size={20}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-500 mb-2">
                  {searchTerm ? "No pastes found" : "No pastes yet"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? "Try adjusting your search terms" 
                    : "Create your first paste to get started"
                  }
                </p>
                {!searchTerm && (
                  <a 
                    href="/" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Create First Paste
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paste;
