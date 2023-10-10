import '../Style/PropertiePage.css';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import propertiePictures from '../assets/Images/BbackgroundPicture.jpg';
// import 'react-dates/initialize';
// import { SingleDatePicker } from "react-dates";
// import 'react-dates/lib/css/_datepicker.css';
import ConfirmationModal from '../components/confirmation';



export default function PropertiePage() {
    const location = useLocation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [propertyData, setPropertyData] = useState(location.state.propertyData);
    const { hostname } = useParams();
    const [title, setTitle] = useState(propertyData.hostProperties[0].title);
    const [locations, setLocation] = useState(propertyData.hostProperties[0].location);
    const [guests, setGuests] = useState(propertyData.hostProperties[0].guests);
    const [bedrooms, setBedrooms] = useState(propertyData.hostProperties[0].bedrooms);
    const [beds, setBeds] = useState(propertyData.hostProperties[0].beds);
    const [baths, setBaths] = useState(propertyData.hostProperties[0].baths);
    const [price, setPrice] = useState(propertyData.hostProperties[0].price);
    const [description, setDescription] = useState(propertyData.hostProperties[0].description);
    const bookedDates = propertyData.hostProperties[0].bookedDates.flat();
    const disabledDates = bookedDates.map(dateStr => new Date(dateStr));
    const [selectedDate, setSelectedDate] = useState('');
    const [imageFileNames, setImageFileNames] = useState(propertyData.hostProperties[0].pictures);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [imageToDelete, setImageToDelete] = useState('');



    const isDateDisabled = (date) => {
        const selectedDate = new Date(date);
        return disabledDates.some(disabledDate => (
            selectedDate.getFullYear() === disabledDate.getFullYear() &&
            selectedDate.getMonth() === disabledDate.getMonth() &&
            selectedDate.getDate() === disabledDate.getDate()
        ));
    };





    useEffect(() => {
        // Carregue os dados do servidor quando o componente for montado
        if (propertyData) {
            // Load data only if propertyData is defined
            fetchData();
        }
    }, [propertyData]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/properties/${hostname}`); // Update the endpoint to accept the hostname
            const data = response.data;
            setPropertyData(data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };



    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleSave = async (hostName, propertyTitle) => {
        // Create a new propertyData object with the updated values
        const updatedPropertyData = {
            hostName,
            hostProperties: propertyData.hostProperties.map((property) => {
                if (property.title === propertyTitle) {
                    return {
                        ...property,
                        title,
                        location: locations,
                        guests,
                        bedrooms,
                        beds,
                        baths,
                        price,
                        description,
                    };
                }
                return property;
            }),
        };

        try {
            // Send a POST request to update the JSON data on the server
            await axios.post(`http://localhost:5000/updateProperty/${hostname}`, updatedPropertyData);

            // Update the local propertyData state with the new values
            setPropertyData(updatedPropertyData);

            // Disable edit mode
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating property data:', error);
        }

        handleSubmit();
    };








    const handleCancel = () => {
        // Recarregue os dados originais ou desative o modo de edição sem salvar
        fetchData();
        setIsEditMode(false);
    };


    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('uploadedFile', file);

        try {
            await axios.post(`http://localhost:5000/upload/${hostname}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // After successful upload, update the imageFileNames state with the new filename
            setImageFileNames([...imageFileNames, file.name]);

            //   alert('File uploaded successfully!');
            setIsEditMode(true);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    // Function to delete an image
    const handleDeleteImage = async (imageName) => {
        try {
            await axios.delete(`http://localhost:5000/deleteImage/${hostname}/${imageName}`);
            // After successful deletion, update the imageFileNames state by filtering out the deleted image
            setImageFileNames((prevImageFileNames) => prevImageFileNames.filter((name) => name !== imageName));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };



    return (
        <>

            <div className='propertyPageWrapper'>
            <Header />
                <div>
                    {isEditMode ? (
                        <>
                            <div className='editWrapper'>
                                <div className='box'>
                                    <div id='edit-image-grid'>
                                        {imageFileNames.map((imageName, index) => (
                                            <img
                                                onClick={() => handleDeleteImage(imageName)}
                                                key={index}
                                                src={`http://localhost:5000/uploads/${imageName}`}
                                                alt={`Property Image ${index + 1}`
                                                }
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <label htmlFor="">Title</label>
                                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Location</label>
                                        <input type="text" value={locations} onChange={(e) => setLocation(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Guest</label>
                                        <input type="text" value={guests} onChange={(e) => setGuests(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Bedroom</label>
                                        <input type="text" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Bed</label>
                                        <input type="text" value={beds} onChange={(e) => setBeds(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Bath</label>
                                        <input type="text" value={baths} onChange={(e) => setBaths(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Price</label>
                                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Description</label>
                                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <div>
                                        <input type="file" onChange={handleFileChange} />
                                        {/* <button onClick={handleSubmit}>Upload</button> */}
                                    </div>
                                    <button onClick={() => handleSave(propertyData.hostName, propertyData.hostProperties[0].title)}>Salvar</button>
                                    <button className='close' onClick={handleCancel}>X</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // <button onClick={handleEdit}>Editar</button>
                        <span></span>
                    )}
                </div>
                <div className='propertyWrapper'>
                    <div className='propertire-main'>
                        <div className='propertieTitle'>
                            <div>
                                <h2 className='title'>{propertyData.hostProperties[0].title}</h2>
                                <button onClick={handleEdit}>
                                    <svg width="1.25rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                            </div>
                            <div className='titleInfo'>
                                <div className='titleBottom'>
                                    <div className='ratingSection'>
                                        <svg width="1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                        <span>{propertyData.hostProperties[0].rating}</span>
                                    </div>
                                    <div>
                                        <span className='location'>{propertyData.hostProperties[0].location}</span>
                                    </div>
                                </div>
                                <div>
                                    <span>
                                        <svg width="16px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                        <span>Share</span>
                                    </span>
                                    <span>
                                        <svg width="16px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span>Save</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='propertie-image-grid-wrapper'>
                            {/* <div className='propertie-image-grid'>
                                <img className='propertie-image-grid-col-2 propertie-image-grid-row-2' src={propertiePictures} alt='' />
                                <img src={propertiePictures} alt='' />
                                <img src={propertiePictures} alt='' />
                                <img src={propertiePictures} alt='' />
                                <img src={propertiePictures} alt='' />
                            </div> */}
                            <div className='propertie-image-grid'>
                                {imageFileNames.map((imageName, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:5000/uploads/${imageName}`}
                                        alt={`Property Image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='infosWrapper'>
                        <div className='description'>
                            <div className='infoBelow'>
                                <h3>Entire cottage hosted by {hostname}</h3>
                                <span className='guest'>{propertyData.hostProperties[0].guests} guests</span>
                                <span>·</span>
                                <span className='bedroom'>{propertyData.hostProperties[0].bedrooms} bedrooms</span>
                                <span>·</span>
                                <span className='bed'>{propertyData.hostProperties[0].beds} beds</span>
                                <span>·</span>
                                <span className='bath'>{propertyData.hostProperties[0].baths} baths</span>
                            </div>
                            <hr />
                            <div>
                                <span className=''>
                                    {propertyData.hostProperties[0].description}
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                                </span>
                            </div>
                        </div>
                        
                            <div className='priceDetails'>
                                <div className='priceTitle'>
                                    <div><span className='priceNight'>${propertyData.hostProperties[0].price} CAD </span><span>night</span></div>
                                    <div className='ratingSection'>
                                        <svg width="1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                        <span className='rating'>{propertyData.hostProperties[0].rating}</span>
                                    </div>
                                </div>
                                <div className='dateDetails'>
                                    <div>
                                        <div id='borderLeft' className='lineBreak'>
                                            <span>Checkin</span>
                                            <span>10-23-2023</span>
                                        </div>
                                        <div id='borderRight' className='lineBreak'>
                                            <span>Checkout</span>
                                            <span>10-28-2023</span>
                                        </div>
                                    </div>
                                    <div id='borderBottom' className='lineBreak'>
                                        <span>Guests</span>
                                        <span>1 guest</span>
                                    </div>
                                </div>
                                <div className='reserveSection'>
                                    <button>Reserve</button>
                                    <span>You won't be charged yet</span>
                                </div>
                                <hr />
                                <div className='priceTotal'>
                                    <span>Total</span>
                                    <span>$1,964 CAD</span>
                                </div>
                            </div>
                        
                    </div>
                </div >
            </div>
        </>
    )
}
