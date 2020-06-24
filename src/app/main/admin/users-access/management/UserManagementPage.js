import React from "react";
import { FusePageCarded } from "@fuse";
import reducer from "./store/reducer";
import withReducer from "app/store/withReducer";
import ComponentHeader from './components/Header'
import UserDataTable from './components/UserDataTable'


function UserManagementPage(props) {

    return (
        <FusePageCarded
            style={{
                marginBottom: '20px',
                borderRadius: '16px'
            }}
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
                contentCard: "rounded-8",
                contentWrapper: "mb12",
            }}
            header={
                <ComponentHeader disabled={false} />
            }
            content={
                <UserDataTable {...props} />
            }
        />
    );
}

export default withReducer("userManager", reducer)(UserManagementPage);
