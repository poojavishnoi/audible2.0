import React,{useState} from "react";
import { useLocation } from "react-router";
import img from "../images/1.jpg";
import { BlogData } from "../data";

function Blog() {

  // const [blogResult, setBlogResult] = useState({})

  const {
    state: { id },
  } = useLocation();

  const singleBlog = BlogData.find((item) => {
    return item.id === id
  })


  console.log(singleBlog);

  return (
    <div className=" mx-52 p-10 text-center bg-amber-100  flex items-center justify-center flex-col">
      <p className=" text-2xl">{singleBlog.title}</p>
      <img
        src={singleBlog.image}
        alt="blog_img"
        className=" object-cover w-1/2 h-1/2 m-10 rounded-lg"
      />
      {singleBlog.content}
    </div>
  );
}

export default Blog;
