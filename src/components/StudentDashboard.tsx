'use client';

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Calendar as CalendarIcon, Clock, BookOpen, FileText, Trash2 } from "lucide-react";
import { UserProfile } from "@/types/user";
import { StudentRecord } from "@/types/fileUpload";
import { fileUploadService } from "@/lib/fileUploadService";
import FileUploadForm from "./FileUploadForm";
import FileList from "./FileList";

interface Session {
  id: string;
  topic: string;
  duration: number;
  date: string;
  user_id: string;
  created_at: string;
}

interface Course {
  id: string;
  name: string;
  semester: string;
  year: string;
  user_id: string;
  created_at: string;
}

interface StudentDashboardProps {
  userProfile: UserProfile;
}

export default function StudentDashboard({ userProfile }: StudentDashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [files, setFiles] = useState<StudentRecord[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [sessionForm, setSessionForm] = useState({
    topic: '',
    duration: 1,
    date: new Date().toISOString().split('T')[0]
  });
  const [courseForm, setCourseForm] = useState({
    name: '',
    semester: 'Fall',
    year: new Date().getFullYear().toString()
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
      await fetchData(session.user.id);
    };

    checkSession();
  }, [supabase.auth, router]);

  const fetchData = async (userId: string) => {
    // Fetch study sessions
    const { data: sessionsData } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Fetch courses
    const { data: coursesData } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Fetch files
    const filesData = await fileUploadService.getUserFiles();

    if (sessionsData) setSessions(sessionsData);
    if (coursesData) setCourses(coursesData);
    setFiles(filesData);
  };

  const handleFileUploadSuccess = () => {
    fetchData(user!.id);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([
          {
            topic: sessionForm.topic,
            duration: sessionForm.duration,
            date: sessionForm.date,
            user_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      setSessions([data[0], ...sessions]);
      setSessionForm({ topic: '', duration: 1, date: new Date().toISOString().split('T')[0] });
      setShowSessionModal(false);
    } catch (error) {
      console.error('Error adding session:', error);
      alert('Failed to add session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            name: courseForm.name,
            semester: courseForm.semester,
            year: courseForm.year,
            user_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      setCourses([data[0], ...courses]);
      setCourseForm({ name: '', semester: 'Fall', year: new Date().getFullYear().toString() });
      setShowCourseModal(false);
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionToDelete.id);

      if (error) throw error;

      setSessions(sessions.filter(s => s.id !== sessionToDelete.id));
      setShowDeleteSessionModal(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete.id);

      if (error) throw error;

      setCourses(courses.filter(c => c.id !== courseToDelete.id));
      setShowDeleteCourseModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteSessionModal = (session: Session) => {
    setSessionToDelete(session);
    setShowDeleteSessionModal(true);
  };

  const openDeleteCourseModal = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteCourseModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Welcome back, {userProfile.display_name || userProfile.email.split('@')[0]}!
        </h1>
        <div className="text-sm text-gray-500 bg-purple-100 px-3 py-1 rounded-full whitespace-nowrap">
          Student
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white border rounded-xl p-4 md:p-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#51ffd6] to-[#00ccff] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {userProfile.display_name?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-gray-900 truncate">{userProfile.display_name || userProfile.email}</p>
          <p className="text-gray-500 text-sm">Student Profile</p>
        </div>
      </div>

      {/* Study Sessions */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">📚 Study Sessions</h2>
          <button
            onClick={() => setShowSessionModal(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add New Session</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition relative group"
              >
                <button
                  onClick={() => openDeleteSessionModal(session)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete session"
                >
                  <Trash2 size={16} />
                </button>
                <h3 className="font-semibold text-lg pr-8 truncate">{session.topic}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-600 text-sm mt-2 space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{session.duration}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon size={14} />
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 text-gray-500">
              No study sessions yet. Add your first one!
            </div>
          )}
        </div>
      </div>

      {/* Saved Courses */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">📌 Saved Courses</h2>
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add New Course</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition relative group"
              >
                <button
                  onClick={() => openDeleteCourseModal(course)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete course"
                >
                  <Trash2 size={16} />
                </button>
                <h3 className="font-semibold pr-8 truncate">{course.name}</h3>
                <p className="text-gray-600 text-sm">{course.semester} · {course.year}</p>
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 text-gray-500">
              No courses saved yet. Add your first one!
            </div>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">📁 Results & Certificates</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Upload Form */}
          <div className="order-2 xl:order-1">
            <FileUploadForm onUploadSuccess={handleFileUploadSuccess} />
          </div>
          
          {/* File List */}
          <div className="order-1 xl:order-2">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Your Files</h3>
            <FileList files={files} onFileDeleted={handleFileUploadSuccess} />
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-auto modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Add New Study Session</h3>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={sessionForm.topic}
                  onChange={(e) => setSessionForm({...sessionForm, topic: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Calculus, Physics, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={sessionForm.duration}
                  onChange={(e) => setSessionForm({...sessionForm, duration: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-auto modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Add New Course</h3>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Physics 101, Calculus II"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  value={courseForm.semester}
                  onChange={(e) => setCourseForm({...courseForm, semester: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  value={courseForm.year}
                  onChange={(e) => setCourseForm({...courseForm, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Session Modal */}
      {showDeleteSessionModal && sessionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-auto modal-content">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900">Delete Study Session</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the study session "{sessionToDelete.topic}"? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowDeleteSessionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSession}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      {showDeleteCourseModal && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-auto modal-content">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900">Delete Course</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the course "{courseToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowDeleteCourseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 