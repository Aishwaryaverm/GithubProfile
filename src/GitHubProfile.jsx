import { useState, useEffect } from "react";
import GithubLogo from "./assets/github.svg";

function GitHubProfile() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setUserData(null);
      setError(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Auto-search if username is set
    if (username) {
      const timeout = setTimeout(() => {
        fetchProfile();
      }, 800); // delay typing

      return () => clearTimeout(timeout); // cleanup
    }
  }, [username]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        GitHub User
      </h1>

      {/* Search Box */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-gray-100 rounded-xl shadow-sm mb-8">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          aria-label="GitHub username"
        />
        <button
          onClick={fetchProfile}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
          aria-label="Search GitHub user"
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading ? <Loader description="Searching for user..." /> : null}

      {/* Error Message */}
      {error ? <ErrorBox error={error} /> : null}

      {/* User Profile Card */}
      {userData && (
        <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg">
          {/* Header/Banner */}
          <div className="bg-gray-900 text-white px-6 py-8 flex flex-col items-center">
            <img
              src={userData.avatar_url}
              alt={`${username}'s avatar`}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-md"
            />
            <h2 className="mt-4 text-2xl font-bold">
              {userData.name || username}
            </h2>
            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline mt-1"
            >
              @{userData.login}
            </a>
            {userData.bio && (
              <p className="text-center mt-3 text-gray-400 max-w-md">
                {userData.bio}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Repositories"
                value={userData.public_repos}
                color="text-green-600"
              />
              <StatCard
                label="Followers"
                value={userData.followers}
                color="text-blue-600"
              />
              <StatCard
                label="Following"
                value={userData.following}
                color="text-purple-600"
              />
              <StatCard
                label="Gists"
                value={userData.public_gists || 0}
                color="text-red-600"
              />
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500 mb-8">
              {userData.company && (
                <DetailItem label="Company" value={userData.company} />
              )}

              {userData.location && (
                <DetailItem label="Location" value={userData.location} />
              )}

              {userData.blog && (
                <DetailItem
                  label="Website"
                  value={
                    <a
                      href={
                        userData.blog.startsWith("http")
                          ? userData.blog
                          : `https://${userData.blog}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {userData.blog}
                    </a>
                  }
                />
              )}

              {userData.email && (
                <DetailItem
                  label="Email"
                  value={
                    <a
                      href={`mailto:${userData.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {userData.email}
                    </a>
                  }
                />
              )}

              {userData.twitter_username && (
                <DetailItem
                  label="Twitter"
                  value={
                    <a
                      href={`https://twitter.com/${userData.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      @{userData.twitter_username}
                    </a>
                  }
                />
              )}

              <DetailItem
                label="Member since"
                value={formatDate(userData.created_at)}
              />
              <DetailItem
                label="Last updated"
                value={formatDate(userData.updated_at)}
              />
            </div>

            {/* View user button */}
            <div className="flex justify-center mt-6">
              <a
                href={userData.html_url}
                target="_blank"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {/* <GithubIcon /> */}
                <img src={GithubLogo} alt="<logo>" className="w-5 h-5 mr-2" />
                View GitHub User Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable components
function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center flex flex-col justify-center">
      <span className={`text-xl md:text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function Loader({ description = "loading..." }) {
  return (
    <div className="text-center py-8">
      <div className="size-10 rounded-full m-auto border-2 border-b-transparent border-l-transparent border-blue-600 animate-spin mb-4 " />
      <p className="text-gray-500 text-lg">{description}</p>
    </div>
  );
}

function ErrorBox({ error = "error occoured!" }) {
  return (
    <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center mb-8">
      <p className="text-red-600 font-medium">{error}</p>
    </div>
  );
}

export default GitHubProfile;