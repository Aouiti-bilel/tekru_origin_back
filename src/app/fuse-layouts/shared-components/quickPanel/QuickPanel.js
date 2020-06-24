import React, {useEffect} from 'react';
import {Divider, Drawer, ListSubheader, Typography} from '@material-ui/core';
import {FuseScrollbars} from '@fuse';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import * as Actions from './store/actions/index'
import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import NewsBlockQuickPanel from 'app/main/origin/news-block/components/quick-panel';
import {makeStyles} from '@material-ui/styles';
import FuseUtils from '@fuse/FuseUtils';

const useStyles = makeStyles(theme => ({
    root: {
        width: 280
    }
}));

function QuickPanel(props) {
    const dispatch = useDispatch();
    const state = useSelector(({quickPanel}) => quickPanel.state);
    const classes = useStyles();

    useEffect(() => {
       //dispatch(Actions.getQuickPanelData());
    }, [dispatch]);

    moment.locale('fr', {
        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact: true,
        weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
        weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        calendar: {
            sameDay: '[Aujourd’hui à] LT',
            nextDay: '[Demain à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[Hier à] LT',
            lastWeek: 'dddd [dernier à] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'dans %s',
            past: 'il y a %s',
            s: 'quelques secondes',
            m: 'une minute',
            mm: '%d minutes',
            h: 'une heure',
            hh: '%d heures',
            d: 'un jour',
            dd: '%d jours',
            M: 'un mois',
            MM: '%d mois',
            y: 'un an',
            yy: '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal: function (number) {
            return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse: /PD|MD/,
        isPM: function (input) {
            return input.charAt(0) === 'M';
        },
        // In case the meridiem units are not separated around 12, then implement
        // this function (look at locale/id.js for an example).
        // meridiemHour : function (hour, meridiem) {
        //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
        // },
        meridiem: function (hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4 // Used to determine first week of the year.
        }
    });


    return (
        <Drawer
            classes={{paper: classes.root}}
            open={state}
            anchor="right"
            onClose={ev => dispatch(Actions.toggleQuickPanel())}
        >
            <FuseScrollbars>

                <ListSubheader component="div">Aujourd'hui</ListSubheader>

                <div className="mb-0 py-16 px-24">
                    <Typography className="mb-12 text-32" color="textSecondary">
                        {moment().format('dddd')}
                    </Typography>
                    <div className="flex">
                        le <Typography className="leading-none text-32" style={{marginRight: '5px'}} color="textSecondary">{moment().format('D')+' '}</Typography>
                        <Typography className="leading-none text-32" color="textSecondary">{moment().format('MMMM')}</Typography>
                    </div>
                </div>
                <Divider/>
                {
                    FuseUtils.hasPermission({slug: 'content', permission: 'can_view'}) && (
                        <NewsBlockQuickPanel closeFn={() => {dispatch(Actions.toggleQuickPanel())}}/>
                    )
                }
            </FuseScrollbars>
        </Drawer>
    );
}

export default withReducer('quickPanel', reducer)(QuickPanel);
