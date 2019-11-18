import Header from '../components/Header';
import { withRouter } from "dva/router";
import { connect } from "dva";
import localStorage from "../utils/localStorage";


function BasicLayout(props) {
  const { location, dispatch } = props;
    
  let hiddenHeader = location.pathname.includes('Login');  
  const headerProps = {
    ...location,
    dispatch,
    userName: localStorage.get("userName")
  };
  
  let headerPanel = <Header {...headerProps} />;

  if (hiddenHeader) {
    headerPanel = null;
  }

  return (
    <div style={{ height: '100%' }}>
      {headerPanel}
      {props.children}
    </div>
  );
}
export default withRouter(
  connect(({ app, loading }) => ({ ...app, loading }))(BasicLayout)
);