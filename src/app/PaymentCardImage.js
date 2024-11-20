import React from 'react';

// ******************** Components ********************
import { cardTypes } from './utils'; 

export const PaymentCardImage = ({ cardType }) => {
    const imageSrc =
        cardTypes.find((type) => type.label === cardType)?.image ||
        `${CLOUD_PATH}cardType/credit-card.png?raw=true`; // Default image if not matched

    return (
        <img
            src={imageSrc}
            alt={cardType || 'Credit Card'}
            style={{ width: '30px', height: '20px', objectFit: 'contain' }}
        />
    );
};
