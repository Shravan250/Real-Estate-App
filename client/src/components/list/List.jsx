import "./list.scss";
import Card from "../card/Card";
import PropTypes from "prop-types";

function List({ posts }) {
  // Ensure posts is an array
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <div className="list">
      {safePosts.length > 0 ? (
        safePosts.map((item) => <Card key={item.id} item={item} />)
      ) : (
        <div>No posts available</div>
      )}
    </div>
  );
}

List.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default List;
