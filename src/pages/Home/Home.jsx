import { Select, Button, DatePicker } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
//import { getAllLocations } from "../../actions/location";
import Navbar from "../../components/navbar/Navbar";
import "./home.css";
import backimage from "../images/chuttersnap-kq8iWoh5-mU-unsplash.jpg";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

function disabledDate(current) {
  return current && current < moment().endOf("day");
}

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    journeyDate: moment().format("YYYY-MM-DD")
  });

  const navigate = useNavigate()

  const fetchloaction = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Cookies.remove('userid');
        localStorage.removeItem('token');
        navigate('/login')
        return
      }
      const locationresponse = await axios.get('https://backend-brahmos-bus.onrender.com/api/location/findlocation', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLocations(locationresponse.data.fetch)
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  },[navigate])

  useEffect(() => {
    fetchloaction()
  }, [fetchloaction])

  const onChangeFrom = val => {
    setFormData({ ...formData, startLocation: val });
  };

  const onChangeTo = val => {
    setFormData({ ...formData, endLocation: val });
  };

  const onChangeDate = val => {
    const journeyDate = val && moment(val._d).format("YYYY-MM-DD");
    setFormData({ ...formData, journeyDate });
  };

  const routeTransition = () => {
      if (!formData.startLocation || !formData.endLocation) {
        alert("Please select both the starting point and destination.");
        return;
      }
    
      navigate(`/searchedbus?startLocation=${formData.startLocation}&endLocation=${formData.endLocation}&journeyDate=${formData.journeyDate}`);
    };


  
 
  return (
    <div className="container">
      <Navbar className="navbar" page={'Booking History'}/>
      <img src={backimage} className="back-image-booking" alt="back-img" />
      <div className="search-container">
        <div className="route-form bus-search-menu m-1">
          <label htmlFor="">
            <h4 className="color-white">From: </h4>
          </label>
          <Select
            showSearch
            className="select-box"
            placeholder="Select start location"
            optionFilterProp="children"
            onChange={onChangeFrom}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {locations.map(location => (
              <Option value={location.name} key={location._id}>
                {location.name}
              </Option>
            ))}
          </Select>
          <label htmlFor="">
            <h4 className="color-white">To: </h4>
          </label>
          <Select
            showSearch
            className="select-box"
            placeholder="Select destination"
            optionFilterProp="children"
            onChange={onChangeTo}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {locations.map(location => (
              <Option value={location.name} key={location._id}>
                {location.name}
              </Option>
            ))}
          </Select>
          <label htmlFor="">
            <h4 className="color-white">Date: </h4>
          </label>
          <DatePicker
            className="date-picker"
            format="DD-MM-YYYY"
            disabledDate={disabledDate}
            onChange={onChangeDate}
            popupClassName="custom-datepicker"  // Add custom styling
          />
          <Button type="primary" className="search-button" onClick={routeTransition}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
