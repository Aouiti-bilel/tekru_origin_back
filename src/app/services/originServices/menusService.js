import { jwtService } from 'app/services/originServices';
import gql from 'graphql-tag'
import apolloService from '../apolloService'

const GQL_CONST = {}

GQL_CONST.menuItemGrapQLString = `
    id
    type
    name
    icon
    color
    order
    link
    external
    data {
        id
        menuItemId
        title
        image
        color_text
        color_background
        link
        external
        order
    }
`;

GQL_CONST.userAccess = `
    access {
        name
        slug
    }
`;

GQL_CONST.adminAccess = `
    auths {
        niveau
        description
    }
`;

GQL_CONST.menuGrapQLString = `
    ${GQL_CONST.menuItemGrapQLString}
    ${GQL_CONST.userAccess}
    children {
        ${GQL_CONST.menuItemGrapQLString}
        ${GQL_CONST.userAccess}
    }
`;

GQL_CONST.adminMenuGrapQLString = `
    ${GQL_CONST.menuItemGrapQLString}
    ${GQL_CONST.adminAccess}
    children {
        ${GQL_CONST.menuItemGrapQLString}
        ${GQL_CONST.adminAccess}
    }
`;

class menusService {
    get = (admin=false) => {
        return new Promise((resolve, reject) => {
            apolloService.query({
                variables: {
                    admin: admin
                },
                query: gql `
                    query (
                        $admin: Boolean
                    ) {
                        menuItems(admin: $admin) {
                            ${admin ? GQL_CONST.adminMenuGrapQLString : GQL_CONST.menuGrapQLString}
                        }
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken()
                    }
                },
                fetchPolicy: 'no-cache'
            }).then(response => {
                resolve(handleServerMenuItems(response.data.menuItems, admin));
            }).catch(error => {
                console.log(error);
                const r = []
                if (error.graphQLErrors) 
                    for (const e of error.graphQLErrors) {
                        r.push({
                            code: e.extensions.code,
                            message: e.message,
                        });
                    }
                reject(r);
            });
        });
    };

    up = (data) => {
        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    data: data
                },
                mutation: gql `
                    mutation (
                        $data: MenuItemInput!
                    ){
                        menuItem(
                            item: $data
                        )
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken(),
                    }
                }
            }).then(response => {
                resolve(parseInt(response.data.menuItem));
            }).catch(error => {
                console.error(error);
                reject(handleErros(error));
            });
        });
    };

    sync = (data, deletedItems) => {
        // If data is a tree
        data = prepareDataToServer(data);
        deletedItems = prepareDataToServer(deletedItems);

        const deletedIds = deletedItems.map(item => item.id);

        return new Promise((resolve, reject) => {
            apolloService.mutate({
                variables: {
                    data: data,
                    deletedIds: deletedIds
                },
                mutation: gql `
                    mutation menuItems(
                        $data: [MenuItemInput]
                        $deletedIds: [Int]
                    ){
                        menuItems(
                            items: $data
                            deletedItems: $deletedIds
                        ) {
                            ${GQL_CONST.menuGrapQLString}
                        }
                    }
                `,
                context: {
                    headers: {
                        'authorization': 'Bearer ' + jwtService.getAccessToken(),
                    }
                }
            }).then(response => {
                resolve(handleServerMenuItems(response.data.menuItems));
            }).catch(error => {
                console.error(error);
                reject(handleErros(error));
            });
        });
    };
}

const handleErros = (error) => {
    const r = []
    if (error.graphQLErrors)
        for (const e of error.graphQLErrors) {
            r.push({
                code: e.extensions.code,
                message: e.message,
            });
        }
    return(r);
}

const prepareDataToServer = (data, parent) => {
    let result = [];
    let order = 1;
    for (const item of data) {
        const node = {
            id: (item.id > 0 ? item.id : null),
            type: item.type,
            name: item.title,
            icon: (item.icon ? item.icon : null),
            color: (item.color ? item.color : null),
            link: item.url,
            external: Boolean(item.external),
            auths: item.auth,
            accessSlug: item.access,
            order: order,
        }
        if (item.data && item.data.length > 0) {
            node.data = [];
            for (const category of item.data) {
                node.data.push({
                    title: category.title,
                    image: category.image,
                    color_text: category.color_text,
                    color_background: category.color_background,
                    link: category.link,
                    external: Boolean(category.external),
                });
            }
        }
        if (parent) {
            node.parentId = parent;
        } else {
            node.parentId = null;
        }
        // Children
        let children = [];
        if (item.children && item.children.length > 0) {
            children = prepareDataToServer(item.children, item.id);
        }
        result = [...result, node, ...children];
        order++;
    }
    return result;
}

const handleServerMenuItems = (items, admin=false) => {
    const data = [];
    if (items.length > 0) {
        for (const item of items) {
            const tmp = {}
            tmp.id = item.id;
            tmp.type = item.type;
            tmp.title = item.name;
            tmp.order = item.order;
            tmp.icon = item.icon;
            if (admin) {
                tmp.auth = [];
                if (item.auths) {
                    tmp.auth = [...item.auths];
                }
            } else if (item.access && item.access.slug) {
                tmp.auth = item.access.slug;
            }
            tmp.color = (item.color ? item.color : false);
            if (tmp.color && tmp.color.indexOf("#") < 0) {
                tmp.color = '#' + tmp.color;
            }
            tmp.children = [];
            if (item.children && item.children.length > 0) {
                const { children } = item;
                delete item.children;
                tmp.children = handleServerMenuItems(children, admin);
            }
            // Set the link
            tmp.url = (item.link === null ? '#' : item.link);
            tmp.external = (item.external && item.external === true);
            if (item.data !== null) {
                tmp.data = item.data;
            }
            data.push(tmp);
        }
    }
    return data;
}

const instance = new menusService();
instance.getAccessToken = jwtService.getAccessToken;
export default instance;
