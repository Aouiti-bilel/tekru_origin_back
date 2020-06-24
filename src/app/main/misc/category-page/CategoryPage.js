import React, { useEffect, useState } from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FusePageSimple} from '@fuse';
import CategoryComponent from './CategoryComponent';
import FuseUtils from '@fuse/FuseUtils';
import { Icon, Typography } from '@material-ui/core';
import {
    useSelector
} from 'react-redux';
import { searchNavTree } from '@CatuFramework/helpers/navTrees';

const styles = theme => ({
    root: {
        minHeight: 'auto'
    },
    layoutRoot: {
        minHeight: 'auto'
    },
});

function CategoryPage(props) {
    const {classes, history} = props;
    const { params } = props.match
    const [categories, setCategories] = useState([]);
    const [pageConfig, setPageConfig] = useState({
        title: '',
        icon: 'adjust'
    });
    const navigation = useSelector(({
        fuse
    }) => fuse.navigation);
    const userRole = useSelector(({auth}) => auth.user.role);

    useEffect(() => {
        const id = parseInt(params.id);
        if (id) {
            const item = searchNavTree(navigation, id);
            if (item) {
                let permission = true;
                if (item.auth) {
                    permission = FuseUtils.hasPermission({
                        slug: item.auth,
                        permission: 'can_view'
                    }, userRole)
                }
                if (permission && item.data && Array.isArray(item.data)) {
                    setPageConfig({
                        id: item.id,
                        title: item.title,
                        icon: item.icon,
                    });
                    setCategories(item.data);
                }
            }
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, navigation]);
    
    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <Icon className="text-18" color="action">{pageConfig.icon ? pageConfig.icon : 'adjust'}</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">{pageConfig.title}</Typography>
                        </div>
                    </div>
                </div>
            }
            content={
                <div className="flex flex-wrap p-24">
                    {
                        categories.length > 0 ? 
                            categories.map((category, i) => {
                                return (
                                    <CategoryComponent
                                        key={i}
                                        parentId={pageConfig.id}
                                        category={category}
                                        history={history}
                                    />
                                )
                            })
                        : (
                            'Aucune catégorie à afficher'
                        )
                    }
                </div>
            }
        />
    )
}

export default withStyles(styles, {withTheme: true})(CategoryPage);