import React, {useEffect, useState} from 'react';
import {Slider} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from '../store/actions';

function UserCheckBoxComponent(props) {
    const { usage, loading } = props;
    const [sliderValue, setSliderValue] = useState(0);
    const [sliderMinValue, setSliderMinValue] = useState(0);
    const [sliderMaxValue, setSliderMaxValue] = useState(0);
    const [sliderMarks, setSliderMarks] = useState([]);
    const dispatch = useDispatch();
    const standardComission = useSelector(({ userManager }) => userManager.standardComission);
    const weeklyHours = useSelector(({ userManager }) => userManager.weeklyHours);
    
    useEffect(() => {
        if(usage === 'weeklyHours'){
            setSliderValue(weeklyHours);
            setSliderMinValue(0);
            setSliderMaxValue(90);
            setSliderMarks([
                {
                    value: 0,
                    label: '0',
                },
                {
                    value: 35,
                    label: '35',
                },
                {
                    value: 40,
                    label: '40',
                },
                {
                    value: 90,
                    label: '90',
                },
            ])
        }else if (usage === 'standardComission'){
            setSliderValue(standardComission);
            setSliderMinValue(0);
            setSliderMaxValue(100);
            setSliderMarks([
                {
                    value: 0,
                    label: '0%',
                },
                {
                    value: 50,
                    label: '50%',
                },
                {
                    value: 100,
                    label: '100%',
                },
            ])
        }
    }, [usage, standardComission, weeklyHours])

    return (
        <Slider
            disabled={ loading }
            value={sliderValue}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={sliderMinValue}
            max={sliderMaxValue}
            marks={sliderMarks}
            onChange={(ev,val)=>{
                setSliderValue(val)
            }}
            onChangeCommitted={(ev,val)=>{
                if(usage=== 'weeklyHours'){
                    dispatch(Actions.setWeeklyHours(val));
                }else if (usage === 'standardComission'){
                    dispatch(Actions.setStandardCommission(val));
                }
            }}
        />
    );
}
 
export default UserCheckBoxComponent;
