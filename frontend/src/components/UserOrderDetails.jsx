import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import {  useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  // const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  // const { id } = useParams();
  const navigate = useNavigate();
  const [kuchvi, setkuchvi] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${server}/kuchvi/get-all-admin-kuchvi-request`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("jklllllllllll",res.data)
      
        setkuchvi(res.data.allKuchviRequest);
        setLoading(false); 
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false); 
      });
  }, []);
  

//   const columns = [
//     {
//     field: "delete",
//     headerName: "Delete",
//     minWidth: 100,
//     flex: 0.7,
//     renderCell: (params) => (
//       params.row.status === "Delivered" ||params.row.status== "Returned"||params.row.status== "Return Request" ? (
//         <Button
//           variant="contained"
//           color="error"
//           disabled={params.row.status== "Returned"?true:params.row.return1}
//           onClick={async () => {
//             // Handle return logic here
//             console.log("================???????", params.row);
//             const response=await axios.patch(`http://localhost:8000/api/v2/kuchvi/update-kuchvi/${params.row.kuchviId}`, {
//               return1:true, // Update the stock value in the request body
//               status:"Return Request"
//               });
      
//               if (response.status >= 200 && response.status < 300) {
//                  console.log("Stock updated successfully");
//               } else {
//                 throw new Error(`Failed to update stock - Unexpected status code: ${response.status}`);
//               }
//               window.location.reload();
//           }}
//         >
//           Return
//         </Button>
//       ) : (
//         <Button
//           variant="contained"
//           color="error"
//           disabled={params.row.status== "Cancelled"?true:params.row.cancel}
//           // disabled={params.row.cancel}
//           onClick={async () => {
//             console.log("================???????", params.row);
//             // const id= params.row._id
//             const orderId = params.row.orderid;
//             const productId = params.row.productid;
//             const size = params.row.size;
//             const qty = 1;
//             const userId = params.row.userId;
//             const status = params.row.status;
//             const shopId = params.row.shopId;
//             const shopPrice = params.row.shopPrice;
//             const markedPrice = params.row.markedPrice;
//             const discountPrice = params.row.discountPrice;
//             const shippingAddress = params.row.address;
//             const refundStatus = params.row.refundStatus;
//             const user=params.row.user;
//             const paymentInfo=params.row.paymentInfo;
//             const productName=params.row.productName;
//             const product=params.row.product;
//             const cancel = params.row.cancel;
//             const delivered = params.row.delivered;
//             const img = params.row.image;
//             const kuchviId=params.row.kuchviId
//             const response=await axios.patch(`http://localhost:8000/api/v2/kuchvi/update-kuchvi/${params.row.kuchviId}`, {
//               cancel:true, // Update the stock value in the request body
//               status:"cancel Request"
//               });
      
//               if (response.status >= 200 && response.status < 300) {
//                  console.log("Stock updated successfully");
//               } else {
//                 throw new Error(`Failed to update stock - Unexpected status code: ${response.status}`);
//               }
//               window.location.reload();
            
//           }}
//         >
//           Cancel
//         </Button>
//       )
//     ),
//   }
// ]
  useEffect(() => {
    if (!loading) {
      const updateRows = () => {
        const newRows = kuchvi.filter(val => val.userId === user._id).map((val, ind) => ({
          id: ind, // Ensure the unique ID for DataGrid is unique
          orderid: val.orderId,
          productid: val.productId,
          size: val.size,
          image: val.img,
          itemsQty: 1,
          total: "Rs" + val.markedPrice,
          status: val.status,
          user:val.user,
          paymentInfo:val.paymentInfo,
          address: val.shippingAddress,
          userId: val.userId,
          shopId: val.shopId,
          delivered: val.delivered,
          cancel: val.cancel,
          
          markedPrice: val.markedPrice,
          productName:val.productName,
          product:val.product,
          discountPrice: val.discountPrice,
          shopPrice: val.shopPrice,
          kuchviId: val.kuchviId,
          return1: val.return1,
          refund:val.refund,
          reundStatus:val.refundStatus,
          paidAt:val.paidAt,
          createdAt:val.createdAt
        }));
        setRows(newRows);
      };

      updateRows();
    }
  }, [kuchvi, user._id, loading]);

  const data = rows.find((item) => item.productid === id);
  console.log("Data:", data);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }


if (!data) {
  return <div>No data found for this order.</div>;
}
//   useEffect(() => {
//     dispatch(getAllOrdersOfUser(user._id));
//   }, [dispatch,user._id]);

  // const data = orders && orders.find((item) => item._id === id);
console.log("selectedItem,,,,,,,,,,,,,,,,,,",data.orderid)
  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: data?.productid,
          kuchviId: data?.kuchviId,
          orderId:data?.orderId
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  
  const refundHandler = async () => {
    await axios.put(`${server}/order/order-refund/${id}`,{
      status: "Processing refund"
    }).then((res) => {
       toast.success(res.data.message);
    dispatch(getAllOrdersOfUser(user._id));
    }).catch((error) => {
      toast.error(error.response.data.message);
    })
  };
  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      console.log("selectedItem,,,,,,,,,,,,,,,,,,",data)
      const groupTitle = data?.kuchviId +" "+data?.productName;
      const userId = data.userId;
      // const sellerId = data.shopId;
      // const sellerId="65fae1d3497be0c126658a67";
      const sellerId=data?.product.adminCreated;
      // console.log("order kr do",data?.cart[0].adminCreated)
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
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      <br />
      <br />
      {data ? (
      <div className="w-full flex items-start mb-5">
        <img
          src={`${data.image}`}
          alt=""
          className="w-[80px] h-[80px]"
        />
        <div className="w-full">
          <h5 className="pl-3 text-[20px]">Product ID: {data.name}</h5>
          <h5 className="pl-3 text-[20px] text-[#00000091]">
          RS{data.discountPrice} x {data.itemsQty}
            {data.size} x {data.itemsQty}
          </h5>
        </div>
        {!data.isReviewed && data.status === "Delivered" ? (
          <div
            className={`${styles.button} text-[#fff]`}
            onClick={() => {
              setOpen(true);
              setSelectedItem(data); // Ensure selectedItem is set correctly
            }}
          >
            Write a review
          </div>
        ) : null}
      </div>
    ) : (
      <p>No data found for this order.</p>
    )}
     

      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${data?.image}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{data?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  RS{data?.discountPrice} x {data?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={reviewHandler}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
           Price: <strong>RS{data?.discountPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
        <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
        <h4 className="pt-3 text-[20px]">
          {data?.address.address1 + " " + data?.address.address2}
        </h4>
        <h4 className="text-[20px]">{data?.address.country}</h4>
        <h4 className="text-[20px]">{data?.address.city}</h4>
        <h4 className="text-[20px]">{data?.address.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
          <br />
          {data?.status === "Delivered" && (
            <div
              className={`${styles.button} text-white`}
              onClick={refundHandler}
            >
              Give a Refund
            </div>
          )}
        </div>
      </div>
      <br />
      <div
        className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`}
        onClick={handleMessageSubmit}
      >
        <span className="text-[#fff] flex items-center">Send Message</span>
      </div>
      <br />
      {data.status=="Delivered" ||data.status=="Returned"||data.status== "Return Request" ?(<Button
            variant="contained"
            color="error"
            disabled={data.status== "Returned"?true:data.return1}
            onClick={async () => {
              // Handle return logic here
              console.log("================???????", data);
              const response=await axios.patch(`http://localhost:8000/api/v2/kuchvi/update-kuchvi/${data.kuchviId}`, {
                return1:true, // Update the stock value in the request body
                status:"Return Request"
                });
        
                if (response.status >= 200 && response.status < 300) {
                   console.log("Stock updated successfully");
                } else {
                  throw new Error(`Failed to update stock - Unexpected status code: ${response.status}`);
                }
                window.location.reload();
            }}
          >
            Return
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            disabled={data.status== "Cancelled"?true:data.cancel}
            // disabled={data.cancel}
            onClick={async () => {
              console.log("================???????", data);
              // const id= data._id
              const orderId = data.orderid;
              const productId = data.productid;
              const size = data.size;
              const qty = 1;
              const userId = data.userId;
              const status = data.status;
              const shopId = data.shopId;
              const shopPrice = data.shopPrice;
              const markedPrice = data.markedPrice;
              const discountPrice = data.discountPrice;
              const shippingAddress = data.address;
              const refundStatus = data.refundStatus;
              const user=data.user;
              const paymentInfo=data.paymentInfo;
              const productName=data.productName;
              const product=data.product;
              const cancel = data.cancel;
              const delivered = data.delivered;
              const img = data.image;
              const kuchviId=data.kuchviId
              const response=await axios.patch(`http://localhost:8000/api/v2/kuchvi/update-kuchvi/${data.kuchviId}`, {
                cancel:true, // Update the stock value in the request body
                status:"cancel Request"
                });
        
                if (response.status >= 200 && response.status < 300) {
                   console.log("Stock updated successfully");
                } else {
                  throw new Error(`Failed to update stock - Unexpected status code: ${response.status}`);
                }
                window.location.reload();
              
            }}
          >
            Cancel
          </Button>
)}
      {/* <Link to="/">
        <div className={`${styles.button} text-white`}>Send Message</div>
      </Link> */}
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;
