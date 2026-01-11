'use client';

export default function AdminSignIn() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Admin Sign In
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Enter your credentials to access the admin dashboard
          </p>
          
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const username = formData.get('username') as string;
              const password = formData.get('password') as string;

              try {
                const res = await fetch('/api/admin/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
                });

                const data = await res.json();

                if (res.ok) {
                  window.location.href = '/admin';
                } else {
                  // Show detailed error message
                  const errorMsg = data.details 
                    ? `${data.error}\n\nDetails: ${data.details}`
                    : data.error || 'Login failed';
                  alert(errorMsg);
                  console.error('Login error response:', data);
                }
              } catch (err: any) {
                console.error('Login request error:', err);
                alert(`Network error: ${err?.message || 'Please check your connection and try again.'}`);
              }
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
