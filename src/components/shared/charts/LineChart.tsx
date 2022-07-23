import { FC } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { generateColor } from 'utils'

const CustomizedDot: FC<any> = (props: any) => {
  const { cx, cy, icon } = props

  return (
    <image x={cx + 5} y={cy - 15} width={30} height={30} xlinkHref={`${process.env.REACT_APP_API_UPLOADS}${icon}`} style={{ borderRadius: 50 }} />
  )
}

export const CustomLineChart = ({ width = '100%', height = 300, data }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart
        data={data?.subjects}
        margin={{
          top: 25,
          right: 30,
          left: 10,
          bottom: 10,
        }}
      >
        <Tooltip />
        <YAxis />
        <XAxis dataKey='title' />
        {data?.students?.map((item, key) => {
          return (
              <Line
                key={key}
                type='monotone'
                dataKey={item.name}
                stroke={generateColor()}
                dot={<CustomizedDot icon={item.profile} />}
              />
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )
}
