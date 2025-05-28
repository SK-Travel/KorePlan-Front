import React from 'react';

const PageTitle = ({ 
    title, 
    subtitle, 
    icon = '', 
    titleSize = '32px',
    backgroundColor = 'white',
    textColor = '#2c3e50',
    subtitleColor = '#7f8c8d',
    padding = '30px 0',
    marginBottom = '20px',
    borderRadius = '16px',
    showShadow = true
}) => {
    return (
        <div style={{
            textAlign: 'center',
            padding: padding,
            backgroundColor: backgroundColor,
            borderRadius: borderRadius,
            marginBottom: marginBottom,
            //boxShadow: showShadow ? '0 4px 20px rgba(0,0,0,0.08)' : 'none'
        }}>
            <h1 style={{
                margin: '0',
                fontSize: titleSize,
                fontWeight: '700',
                color: textColor,
                marginBottom: subtitle ? '10px' : '0'
            }}>
                {icon && <span style={{ marginRight: '10px' }}>{icon}</span>}
                {title}
            </h1>
            
            {subtitle && (
                <p style={{
                    margin: '0',
                    fontSize: '16px',
                    color: subtitleColor
                }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default PageTitle;