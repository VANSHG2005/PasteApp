import { Copy, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToPastes, updatePastes, setCurrentUser } from "../redux/pasteSlice";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");  
  const pastes = useSelector((state) => state.paste.pastes);
  const currentUser = useSelector((state) => state.paste.currentUser);
  const dispatch = useDispatch();

  // Initialize user ID if not set
  useEffect(() => {
    if (currentUser === "guest") {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      dispatch(setCurrentUser(userId));
    }
  }, [currentUser, dispatch]);

  const createPaste = () => {
    const paste = {
      title: title,
      content: value,
      _id:
        pasteId ||
        Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updatePastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    setTitle("");
    setValue("");

    setSearchParams({});
  };

  const resetPaste = () => {
    setTitle("");
    setValue("");
    setSearchParams({});
  };

  useEffect(() => {
    if (pasteId) {
      const paste = pastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      }
    }
  }, [pasteId, pastes]);


  return (
    <div className="w-full min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {pasteId ? "Edit Your Paste" : "Create New Paste"}
          </h1>
          <p className="text-gray-600">
            {pasteId ? "Make changes to your existing paste" : "Share your thoughts, code, or ideas with the world"}
          </p>
        </div>

        {/* Title Input and Action Buttons */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paste Title
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter a descriptive title for your paste..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              {pasteId && (
                <button
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center whitespace-nowrap"
                  onClick={resetPaste}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Reset
                </button>
              )}
              
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                onClick={createPaste}
                disabled={!title.trim() || !value.trim()}
              >
                {pasteId ? "Update Paste" : "Create Paste"}
              </button>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paste Content
          </label>
          <div className="border-2 border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm text-gray-500 font-medium">Editor</span>
              </div>
              
              <button
                className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors duration-200"
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  toast.success("Copied to Clipboard", {
                    position: "top-right",
                  });
                }}
                title="Copy content"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* TextArea */}
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Start writing your content here... You can include code, text, or any other information you'd like to share."
              className="w-full p-4 focus:outline-none resize-none bg-transparent text-gray-800 placeholder-gray-400 leading-relaxed"
              style={{
                caretColor: "#3b82f6",
                minHeight: "400px",
              }}
              rows={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
