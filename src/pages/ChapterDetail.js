import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourse } from '../store/slices/courseSlice';
import { getQuizScore, saveQuizScore } from '../store/slices/progressSlice';

const ChapterDetail = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course, isLoading: courseLoading } = useSelector((state) => state.courses);
  const { currentProgress, isLoading: progressLoading } = useSelector((state) => state.progress);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    dispatch(getCourse(courseId));
    dispatch(getQuizScore({ courseId, chapterId }));
  }, [dispatch, courseId, chapterId]);

  useEffect(() => {
    if (currentProgress?.quizScores) {
      const quizScore = currentProgress.quizScores.find(
        (qs) => qs.chapter.toString() === chapterId
      );
      if (quizScore) {
        setScore(quizScore);
        setQuizCompleted(true);
      }
    }
  }, [currentProgress, chapterId]);

  if (courseLoading || progressLoading || !course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const chapter = course.chapters.find((ch) => ch._id === chapterId);
  if (!chapter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Chapter not found</h2>
      </div>
    );
  }

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setAnswers(new Array(chapter.quiz.questions.length).fill(null));
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    const totalQuestions = chapter.quiz.questions.length;
    const correctAnswers = answers.filter(
      (answer, index) => answer === chapter.quiz.questions[index].correctAnswer
    ).length;

    const quizScore = {
      score: correctAnswers,
      maxScore: totalQuestions
    };

    try {
      await dispatch(
        saveQuizScore({
          courseId,
          chapterId,
          ...quizScore
        })
      ).unwrap();
      setScore(quizScore);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Failed to save quiz score:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {chapter.title}
            </h1>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
            </div>

            {chapter.videoUrl && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Video Lesson
                </h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={chapter.videoUrl}
                    title="Chapter Video"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}

            {chapter.resources && chapter.resources.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Additional Resources
                </h2>
                <ul className="space-y-2">
                  {chapter.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!showQuiz && !quizCompleted && (
              <div className="mt-8">
                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Quiz
                </button>
              </div>
            )}

            {showQuiz && !quizCompleted && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quiz: Question {currentQuestion + 1} of{' '}
                  {chapter.quiz.questions.length}
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-gray-900">
                    {chapter.quiz.questions[currentQuestion].question}
                  </p>
                  <div className="space-y-2">
                    {chapter.quiz.questions[currentQuestion].options.map(
                      (option, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion}`}
                            checked={answers[currentQuestion] === option.text}
                            onChange={() =>
                              handleAnswerSelect(currentQuestion, option.text)
                            }
                            className="h-4 w-4 text-indigo-600"
                          />
                          <span className="text-gray-900">{option.text}</span>
                        </label>
                      )
                    )}
                  </div>
                  <div className="flex justify-between mt-6">
                    {currentQuestion > 0 && (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                    )}
                    {currentQuestion < chapter.quiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {quizCompleted && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quiz Results
                </h2>
                <p className="text-lg text-gray-900">
                  Your score: {score.score} out of {score.maxScore}
                </p>
                <p className="mt-2 text-gray-600">
                  {score.score >= chapter.quiz.passingScore
                    ? 'Congratulations! You have passed the quiz.'
                    : 'You need to score higher to pass the quiz. Try again!'}
                </p>
                {score.score < chapter.quiz.passingScore && (
                  <button
                    onClick={handleStartQuiz}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Retry Quiz
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Course Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>
                    {Math.round(
                      (currentProgress?.completedChapters?.length || 0 /
                        course.chapters.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((currentProgress?.completedChapters?.length || 0) /
                          course.chapters.length) *
                        100
                      }%`
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Course Chapters
                </h4>
                <ul className="space-y-2">
                  {course.chapters.map((ch, index) => (
                    <li
                      key={ch._id}
                      className={`text-sm ${
                        ch._id === chapterId
                          ? 'text-indigo-600 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      <button
                        onClick={() =>
                          navigate(`/courses/${courseId}/chapters/${ch._id}`)
                        }
                        className="hover:text-indigo-900"
                      >
                        Chapter {index + 1}: {ch.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail; 