import React from 'react';

function FuseSplashScreen()
{
    return (
        <div id="fuse-splash-screen">

            <div className="center">

                <div className="logo">
                    <img src="assets/images/logos/logo-b.svg" alt="logo"/>
                </div>
                <div className="spinner-wrapper">
                    <div className="spinner">
                        <div className="inner">
                            <div className="gap"/>
                            <div className="left">
                                <div className="half-circle"/>
                            </div>
                            <div className="right">
                                <div className="half-circle"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(FuseSplashScreen);
