const randomImage = () => {
  const randomIndex = Math.floor(Math.random() * 10);
  return `https://i.pravatar.cc/300?img=${randomIndex}`;
};

function StudentCard() {
  return (
    <div className="card">
      <img src={randomImage()} alt="Student avatar" className="card__image" />
      <div className="card__body">
        <h3 className="card__name">Aarav Sharma</h3>
        <p className="card__role">Frontend Track</p>
      </div>
      <div className="card__footer">
        <button type="button" className="btn">
          View Profile
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
