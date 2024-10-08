import React, { useRef, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { deleteReq, postReq, getReq, updateReq } from "./fetch";
import './css/resturants.css'
import Cookies from 'js-cookie';
import { UserContext } from './UserProvider'
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Button from '@mui/joy/Button';

export default function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [updateRestaurant, setUpdateRestaurant] = useState(false);
  const [isManager, setIsManager] = useState(true);
  const [newRestaurant, setNewRestaurant] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState(false);
  const [currentRestaurants, setCurrentRestaurants] = useState([]);

  const { user, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors }, } = useForm();

  useEffect(() => {
    if (user == null) {
      navigate('/login')
    }
    getData();
  }, []);

  useEffect(() => {
  }, [restaurants, isManager]);

  const getData = async () => {
    try {
      const data = await getReq("restaurant");
      setRestaurants(data);
      setCurrentRestaurants(data);

      user.isManager ? setIsManager(true) : setIsManager(false);
    }
    catch (err) {
      alert("Unable to enter data, please try again.")
    }
  };

  function logOut() {
    if (confirm(user.username + ", are you sure you want to log out? ")) {
      const cookieNames = Object.keys(Cookies.get());
      cookieNames.forEach(cookieName => {
        Cookies.remove(cookieName);
      });
      setCurrentUser(null);
      navigate("/login");
    }
  }



  function updateCurrentRestaurant(restaurant) {
    setUpdateRestaurant(true);
    setRestaurantDetails(restaurant);
  }



  const UpdateRestaurnt = async (details) => {
    const body = {
      Name: details.name,
      Address: details.address,
      PhoneNumber: details.phoneNumber,
      ImageURL: details.imageURL,
      Description: details.description
    };

    try {
      await updateReq("restaurant", body, restaurantDetails.RestaurantID);
      const updatedRestaurants = [...restaurants];
      const index = updatedRestaurants.findIndex(it => it.RestaurantID === restaurantDetails.RestaurantID);

      if (index !== -1) {
        updatedRestaurants[index] = { ...updatedRestaurants[index], ...body };
      }
      setRestaurants(updatedRestaurants);
      setCurrentRestaurants(updatedRestaurants)
      setUpdateRestaurant(false);
    }
    catch (err) {
      alert("Not successful, please try again.")
    }
  };

  const deleteRestaurant = async (restaurantID) => {
    try {
      await deleteReq("restaurant", restaurantID)
      setRestaurants(restaurant => restaurant.filter((item) => item.RestaurantID !== restaurantID))
      setCurrentRestaurants(restaurant => restaurant.filter((item) => item.RestaurantID !== restaurantID))
    }
    catch (err) {
      alert("Not successful, please try again.")
    }

  }

  const addRestaurant = async (details) => {
    try {
      let post = await postReq("restaurant", {
        Name: details.name,
        Address: details.address,
        PhoneNumber: details.phoneNumber,
        ImageURL: details.imageURL,
        Description: details.description
      });
      setRestaurants(prevRestaurants => [...prevRestaurants, post.data]);
      setCurrentRestaurants(prevRestaurants => [...prevRestaurants, post.data])
      setNewRestaurant(false)
    }
    catch (err) {
      alert("Not successful, please try again.")
    }
  }
  const searchByName = (search) => {
    setRestaurants(currentRestaurants.filter((item) => item.Name.includes(search.name)));
  }
  const handleSearch = (e) => {
    const search=e.target.value;
    setRestaurants(currentRestaurants.filter((item) => item.Description.includes(search)));
  }
  return (
    <>
      <h1>welcome {user.username}!!</h1>
      <h1>Happy shopping...</h1>
      <form onSubmit={handleSubmit(searchByName)} className="forms">
        <input type="text" placeholder="search by name" {...register("name")} /></form>
<h3>Select by:</h3>
<div>
      <select
        name="category"
        id="category"
        onChange={handleSearch}
      >
        <option value="">All</option>
        <option value="dairy">dairy</option>
        <option value="sushi">sushi</option>
        <option value="sandwich">sandwich</option>

      </select>
      </div>
      <h3>our resturants</h3>

      {isManager ? <Button onClick={() => newRestaurant ? setNewRestaurant(false) : setNewRestaurant(true)} variant="outlined" color="neutral" >New Restaurnt</Button> : <></>}
      {
        newRestaurant && <form onSubmit={handleSubmit(addRestaurant)} className="forms">
          <input type="text" placeholder="name" {...register("name")} />
          <input type="number" placeholder="phone number" {...register("phoneNumber")} />
          <input type="text" placeholder="Address" {...register("address")} />
          <input type="text" placeholder="imageURL" {...register("imageURL")} />
          <input type="text" placeholder="Description" {...register("description")} />
          <button type="submit" className="BTNforns">Add Restaurnt</button>
        </form>
      }

      {updateRestaurant && <form onSubmit={handleSubmit(UpdateRestaurnt)} className="forms">
        <input type="text" placeholder="name" defaultValue={restaurantDetails.Name} {...register("name")} />
        <input type="number" placeholder="phone number" defaultValue={restaurantDetails.PhoneNumber} {...register("phoneNumber")} />
        <input type="text" placeholder="Address" defaultValue={restaurantDetails.Address} {...register("address")} />
        <input type="text" placeholder="imageURL" defaultValue={restaurantDetails.ImageURL} {...register("imageURL")} />
        <input type="text" placeholder="Description" defaultValue={restaurantDetails.Description} {...register("description")} />
        <button type="submit" className="BTNforns">update Restaurnt</button>
      </form>}

      <Grid
        container
        spacing={{ xs: 3, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 10 }}
        sx={{ justifyContent: "flex-end" }}
      >
        {restaurants.map((restaurant) => (
          <Grid columnSpacing={2} rowSpacing={2} justifyContent="center" md={2} container key={restaurant.RestaurantID}>
            <Card variant="outlined" sx={{ width: 300 }} key={restaurant.RestaurantID}>
              <CardOverflow>
                <AspectRatio ratio="2">
                  <Link
                    to={`/user/${user.username}/${restaurant.RestaurantID}/restaurantMenu`}
                    state={{ detailRestuarant: { restaurant } }}
                  >
                    <img src={restaurant.ImageURL}
                      loading="lazy"
                      alt="">
                    </img>
                  </Link>
                  {isManager ? <span >
                    <Button onClick={() => deleteRestaurant(restaurant.RestaurantID)} variant="outlined" color="neutral" >  🗑  </Button>
                  </span> : <></>}
                  {isManager ? <span >
                    <Button onClick={() => updateCurrentRestaurant(restaurant)} variant="outlined" color="neutral" >  🖊  </Button>
                  </span> : <></>}
                </AspectRatio>
              </CardOverflow>
              <CardContent>
                <Typography level="title-md">{restaurant.Name}</Typography>
                <Typography level="body-sm">{restaurant.Address}</Typography>
                <Typography level="body-sm">{restaurant.Description}</Typography>

              </CardContent>
              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
              </CardOverflow>
            </Card>
          </Grid>))}
      </Grid >
      <button onClick={logOut}>Log Out</button>
    </>
  )
}
