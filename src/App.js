import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { locationApiBaseUrl, locationApiParams } from './constants';
function App() {
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingSearch, setSearchLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState({});
    const handleSelect = (placeId) => {
        const newLocation = locations.find((location) => location?.place_id === placeId);
        setLocation(newLocation);
    };
    const [locations, setLocations] = useState([]);
    const [notFound, setNotfound] = useState('');
    const handleSearch = async () => {
        try {
            setSearchLoading(true);
            const { data } = await axios.get(
                `${locationApiBaseUrl}/${search}`,
                {
                    params: {
                        ...locationApiParams,
                    },
                }
            );
            if (data.length) {
                setLocations(data);
            } else {
                setLocations([]);
                setNotfound('No locations found');
            }
            setSearchLoading(false);
        } catch (err) {
            console.log(err);
            setSearchLoading(false);
        }
    };
    const getLocation = async () => {
        try {
            setLoadingLocation(true);
            const { data } = await axios.get(`${locationApiBaseUrl}/boston`, {
                params: { ...locationApiParams, limit: 1 },
            });
            if (data.length) {
                setLocation(data[0]);
                setLoadingLocation(false);
            } else {
                setNotfound('No location found');
            }
        } catch (err) {
            console.log(err);
            setLoadingLocation(false);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);
    return (
        <>
            <div className='App'>
                <div className='search'>
                    <div className='search-input'>
                        <input
                            type='text'
                            className='search-box'
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search location'
                        />
                        <input
                            type='button'
                            className='search-button'
                            value='Search'
                            onClick={handleSearch}
                        />
                    </div>
                    <div className='search-results'>
                        {loadingSearch ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <ul>
                                    {locations.map((location) => {
                                        const {
                                            place_id: placeId,
                                            icon,
                                            display_name: displayName,
                                        } = location;
                                        return (
                                            <li key={placeId}>
                                                <button
                                                    onClick={() =>
                                                        handleSelect(placeId)
                                                    }>
                                                    <img
                                                        src={icon}
                                                        alt={displayName}
                                                    />
                                                    {displayName}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <p>
                                    {!locations.length && notFound && notFound}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div className='map'>
                    <p>Location</p>
                    {loadingLocation ? (
                        <p>Loading ...</p>
                    ) : (
                        <>
                            <p>{location?.display_name}</p>
                            <svg>
                                <path d={location?.svg} />
                            </svg>
                            <p>{!location && notFound && notFound}</p>
                        </>
                    )}
                </div>
                <div className='details'>
                    {loadingLocation ? (
                        <p>Loading ...</p>
                    ) : (
                        <>
                            <p>
                                Population year:
                                {location?.extratags
                                    ? location?.extratags[
                                          'census:population'
                                      ] || 'Not available'
                                    : 'Not available'}
                            </p>
                            <p>
                                Population :
                                {location?.extratags?.population ||
                                    'Not available'}
                            </p>
                            <p>{!location && notFound && notFound}</p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
