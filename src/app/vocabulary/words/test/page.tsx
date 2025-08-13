export default function WordsTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Words Vocabulary Test Page
      </h1>
      <p className="text-lg text-gray-600">
        If you can see this page, the words route is working correctly!
      </p>
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Route Status:</h2>
        <p className="text-green-700">✅ Words vocabulary route is accessible</p>
        <p className="text-green-700">✅ Basic routing is working</p>
        <p className="text-green-700">✅ Next.js is recognizing the new routes</p>
      </div>
    </div>
  );
} 