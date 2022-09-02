
const UserProfile: React.FC<{ user }> = ({ user }) => {
  return (
    <div className="box-center">
      <img alt="avatar" src={user.photoURL} className="card-img-center" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};

export default UserProfile;
