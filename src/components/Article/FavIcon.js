import React from 'react';
import { Bind } from 'statium';

const FavIcon = ({ slug, favorited, favoritesCount }) => (
    <Bind controller>
        { (_, { $dispatch }) => {
            const favCls = `btn btn-sm ${favorited ? 'btn-primary' : 'btn-outline-primary'}`;
            const favTitle = !favorited ? "Love this!" : "Nah, not so good";
            const favHandler = e => {
                e.preventDefault();
                
                $dispatch(favorited ? 'unfavorite' : 'favorite', slug);
            };
            
            return (
                <button className={favCls}
                    title={favTitle}
                    onClick={favHandler}>
                    <i className="ion-heart" /> {favoritesCount}
                </button>
            );
        }}
    </Bind>
);

export default FavIcon;
