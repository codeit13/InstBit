// import React from "react";
// import { connect } from "react-redux";
// import FacebookLogin from "react-facebook-login";

// import { login, logout } from "../services/actions";

// import "./css/Home.css";

// function Home({ loginHandler, logOutHandler, userAuth }) {
//   return (
//     <div>
//       <h1>Home Component</h1>
//       {!userAuth?.isLoggedin ? (
//         <FacebookLogin
//           appId="790248245606669"
//           autoLoad={true}
//           fields="name,email,picture"
//           scope="public_profile,,instagram_basic,instagram_content_publish,instagram_manage_insights,instagram_manage_comments"
//           callback={loginHandler}
//           icon="fa-facebook"
//         />
//       ) : (
//         <div>
//           <img src={userAuth?.user?.picture?.data?.url} alt="Profile Pic" />
//           <div>
//             <span>Already logged in as </span>{" "}
//             <span className="text-bold">{userAuth?.user.name}</span>
//           </div>
//           <button onClick={() => logOutHandler()}>Logout</button>
//         </div>
//       )}
//     </div>
//   );
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     loginHandler: (data) => {
//       dispatch(login(data));
//     },
//     logOutHandler: (data) => {
//       dispatch(logout(data));
//     },
//   };
// };

// const mapStateToProps = (state) => {
//   return {
//     userAuth: state.userAuth,
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Home);
