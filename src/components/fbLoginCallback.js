import React from "react";
import { connect } from "react-redux";

const fbLoginCallback = (props) => {
  return <div>Logged in successfully</div>;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(fbLoginCallback);
