import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart, updateTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";
// import { BsSortNumericDownAlt } from "react-icons/bs";

const ProductDetails =  ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size
  const [showDescription, setShowDescription] = useState(false);
//const [adminuser,setadminuser]=useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // useEffect(async()=>{
  //   // const res5 = await axios.get(`${server}/user/user-info/65fae1d3497be0c126658a67`)
  //   const res5 = await axios.get(`${server}/user/user-info/65fae1d3497be0c126658a67`)

  //   setadminuser(res5.data.user)
  // },[])
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist, dispatch]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };
  const addToCartHandler2 = async (data, selectedSize, count) => {
    console.log("addToCartHandler2", data._id, selectedSize, count);
    const selectedProduct = data.stock.find(
      (item) => item.size === selectedSize
    );
    if (selectedProduct.quantity < count) {
      toast.error("Insufficient quantity available for the selected size!");
      return;
    }
    // console.log("id23",id)
    const isItemExists =
      cart &&
      cart.find((i) => {
        return i._id === data._id;
      });
    console.log("item exist", isItemExists);
    if (isItemExists) {
   
      let newData = JSON.parse(JSON.stringify(isItemExists));
      // console.log("newData1",newData)

      newData.stock.forEach((val) => {
        if (val.size === selectedSize) {
          val.isSelected = true;
          val.qty = count;
          // val.quantity=val.quantity-count;
        }
      });
      // newData.qty = count;
      console.log("newData2updated", newData);
      let newCart = JSON.parse(JSON.stringify(cart));
      // Find the index of the item in newCart array
      const itemIndex = newCart.findIndex(
        (item) => item._id === isItemExists._id
      );

      if (itemIndex !== -1) {
        // Update the item at the found index with newData
        newCart[itemIndex] = newData;
        console.log("newCart updated", newCart);
      } else {
        console.log("Item not found in newCart array");
      }
      // newCart.forEach((val1)=>{
      //   if(val1._id==isItemExists.id){
      //       val1=newData
      //   }
      // })
      try {
        // await updateStockAfterOrderCreation(itemToUpdate);
        dispatch(updateTocart(newCart));
        toast.success("Item updated to cart successfully!");
      } catch (error) {
        console.error("Error updating stock:", error.message);
        toast.error("Failed to add item to cart!");
      }
    } else {
      let newData = JSON.parse(JSON.stringify(data));
      // console.log("newData1",newData)

      newData.stock.forEach((val) => {
        if (val.size === selectedSize) {
          val.isSelected = true;
          val.qty = count;
          // val.quantity=val.quantity-count;
        } else {
          val.qty = 0;
        }
      });
      //newData.qty = count;
      console.log("newData2", newData);
      try {
        // await updateStockAfterOrderCreation(itemToUpdate);
        dispatch(addTocart(newData));
        toast.success("Item added to cart successfully!");
      } catch (error) {
        console.error("Error updating stock:", error.message);
        toast.error("Failed to add item to cart!");
      }
    }
  };

  const addToCartHandler = async (id, selectedSize, count) => {
    console.log("mycart777", id);
    // const isItemExists =
    //   cart &&
    //   cart.find((i) => {
    //     // console.log("iiiiiiiiii", i);
    //     const m1 = i.stock.find((ite) => {
    //       return ite._id == id;
    //     });
    //     console.log("m1m1", m1);
    //     if (m1 == undefined) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //     // return i._id === id;
    //   });
    // console.log("klklkl", isItemExists);
    // //console.log("iiiidddddd", stock[0].size._id);
    // if (isItemExists && false) {
    //   toast.error("Item already in cart!");
    // } else {
    //   if (selectedSize === "") {
    //     toast.error("Please select a size!");
    //   } else {
    //     const selectedProduct = data.stock.find(
    //       (item) => item.size === selectedSize
    //     );
    //     if (!selectedProduct || selectedProduct.quantity < 1) {
    //       toast.error("Selected size not available or out of stock!");
    //     } else {
    //       const updatedStock = data.stock.map((item) =>
    //         item.size === selectedSize
    //           ? { ...item, quantity: item.quantity - count }
    //           : item
    //       );
    //       const cartData = {
    //         ...data,
    //         stock: updatedStock,
    //         qty: count,
    //         size: selectedSize
    //       };
    //       console.log("cartDatacartData", cartData);
    //       console.log("stock", updatedStock);

    //       try {
    //         // await updateStockAfterOrderCreation(itemToUpdate);
    //         dispatch(addTocart(cartData));
    //         toast.success("Item added to cart successfully!");
    //       } catch (error) {
    //         console.error("Error updating stock:", error.message);
    //         toast.error("Failed to add item to cart!");
    //       }
    //     }
    //   }
    // }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      // const adminId = data.shop._id;
      // const adminId="65fae1d3497be0c126658a67";
      const sellerId=data?.product.adminCreated;
      // console.log("data.adminCreated",data?.cart[0].adminCreated)

      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };
  
  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full sm:py-5 lg:py-10">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${data && data.images[select]?.url}`}
                  alt=""
                  className="w-full sm:w-[80%] mx-auto border border-gray-300 m-3 p-1 rounded"
                  style={{ transitionDelay: "800ms" }}
                />
                <div className="w-full flex p-2 py-0 lg:pl-12">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          select === 0 ? "border" : "" // Remove "null"
                        } cursor-pointer`}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          className="h-[60px] overflow-hidden mr-3 mt-3 sm:hover:cursor"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                  <div
                    className={`${
                      select === 1 ? "border" : "null"
                    } cursor-pointer`}
                  ></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-10">
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center">
                    <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                    <AiOutlineInfoCircle
                      size={24}
                      className="text-gray-600 ml-2 cursor-pointer"
                      onMouseEnter={() => setShowDescription(true)}
                      onMouseLeave={() => setShowDescription(false)}
                    />
                  </div>
                  <p className={`${showDescription ? "block" : "hidden"} mt-2`}>
                    {data.description}
                  </p>
                  <div className="flex pt-2">
                    <h4 className={`${styles.productDiscountPrice}`}>
                      ₹ {data.discountPrice}
                    </h4>
                    <h3 className={`${styles.price}`}>
                      {data.originalPrice ? "₹" + data.originalPrice : null}
                    </h3>
                  </div>
                </div>
                {/* <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                </div> */}

                {/* select size  */}
                <div className="flex items-center pt-8">
                  <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full">
                    <div className="mr-4">
                      <label
                        htmlFor="sizeSelect"
                        className="font-medium text-gray-800 text-lg"
                      >
                        Select Size:
                      </label>
                      <div className="flex flex-wrap mt-8">
                        {data.stock.map((item) => {
                          // Calculate the isAvailable variable outside of the JSX
                          const isAvailable = item.quantity > 0;

                          // Calculate the button classes based on whether the item is available
                          const sizeButtonClasses = isAvailable
                            ? `mr-2 mb-2 px-3 py-1 border rounded-full focus:outline-none ${
                                selectedSize === item.size
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }`
                            : `mr-2 mb-2 px-3 py-1 border rounded-full cursor-not-allowed focus:outline-none bg-gray-300 text-gray-400 border-gray-300 line-through`;
                          return (
                            <button
                              key={item.size}
                              className={sizeButtonClasses}
                              onClick={() => {
                                if (isAvailable) {
                                  setSelectedSize(item.size);
                                }
                              }}
                              // disabled={!isAvailable} // Optionally, you can add this to disable the button if the size is not available
                            >
                              {item.size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Button container */}
                <div className="relative" style={{ zIndex: 1 }}>
                <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg p-2" style={{ zIndex: 0 }}>                  <div className="flex justify-between items-center">
                    {/* Add to Cart Button */}
                    <div
                      className={`${styles.button} !mt-6 !rounded !h-11 flex items-center mr-10`}
                      onClick={() => {
                        if (selectedSize === "") {
                          toast.error("Please select a size!");
                          return;
                        }
                        const j1 = data.stock.find(
                          (val) => val.size === selectedSize
                        );
                        console.log("object data", data);
                        addToCartHandler2(data, selectedSize, count);
                      }}
                    >
                      <span className="text-white flex items-center">
                        Add to Cart{" "}
                        <AiOutlineShoppingCart className="ml-2" size={20} />
                      </span>
                    </div>

                    {/* Add to Wishlist Button */}
                    <div
                      className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                      onClick={() => {
                        if (click) {
                          removeFromWishlistHandler(data);
                        } else {
                          addToWishlistHandler(data);
                        }
                      }}
                    >
                      <span className="text-white flex items-center">
                        Add to Wishlist
                        {click ? (
                          <AiFillHeart
                            size={20}
                            color="red"
                            className="ml-2"
                            title="Remove from wishlist"
                          />
                        ) : (
                          <AiOutlineHeart
                            size={24}
                            color="white"
                            className="ml-2"
                            title="Add to wishlist"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

                {/* for large screen */}
                <div className=" hidden md:block items-center mt-6">
                  <div className="flex">
                    <div
                      className={`${styles.button} !mt-6 !rounded !h-11 flex items-center mr-10`}
                      onClick={() => {
                        if (selectedSize === "") {
                          toast.error("Please select a size!");
                          return;
                        }
                        const j1 = data.stock.find(
                          (val) => val.size === selectedSize
                        );
                        console.log("object data", data);
                        addToCartHandler2(data, selectedSize, count);
                      }}
                    >
                      <span className="text-white flex items-center">
                        Add to Cart{" "}
                        <AiOutlineShoppingCart className="ml-2" size={20} />
                      </span>
                    </div>

                    <div
                      className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                      onClick={() => {
                        if (click) {
                          removeFromWishlistHandler(data);
                        } else {
                          addToWishlistHandler(data);
                        }
                      }}
                    >
                      <span className="text-white flex items-center">
                        Add to Wishlist
                        {click ? (
                          <AiFillHeart
                            size={20}
                            color="red"
                            className="ml-2"
                            title="Remove from wishlist"
                          />
                        ) : (
                          <AiOutlineHeart
                            size={24}
                            color="white"
                            className="ml-2"
                            title="Add to wishlist"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* for shop */}
                <div className=" hidden md:block items-center pt-8">
                  <div className="flex pt-5">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  
                   {/*<img
                      src={`${adminuser?.avatar?.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                />*/}
                 
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                   
                      {/* <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {adminuser?.name}
                      </h3> */}
                    
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div>
                  {/* <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message1 <AiOutlineMessage className="ml-1" />
                    </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
<p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line overflow-hidden break-words">
              {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;