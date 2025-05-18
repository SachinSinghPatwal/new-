const Heading = ({ title, meta }) => {
  return (
    <div className="heading">
      <h2 className="heading__title">{title}</h2>
      <span className="heading__meta">{meta}</span>
    </div>
  );
};

export default Heading;
