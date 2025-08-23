import React from 'react';
import {Chart as ChartJS} from 'chart.js/auto';
import {Bar, Doughnut, Line} from 'react-chartjs-2';

export const Chart = () => {
    return(
        <>
        <Doughnut 
        data={
        {
          labels: ["A","B","C"],
          datasets: [
            {label: "Revenue",
            data: [200,300,400],
            }, 
            {
              label: "Loss",
              data: [90, 80, 70]
            }
          ]
        }
      }
      style={{height: '12px', width: '12px' }}
        />
        </>
    )
}