import useTheme from 'hooks/useTheme'
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded'

export const CircleIcon = ({ icon, star = false, height = 30, width = 30 }) => {
  const { theme } = useTheme()
  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      {star && (
        <MilitaryTechRoundedIcon
          style={{ color: '#FFD700', position: 'absolute', top: -3, right: -7 }}
        />
      )}
      <div
        style={{
          minWidth: 30,
          minHeight: 30,
          width: height,
          height: width,
          borderRadius: theme.radius.circle,
          overflow: 'hidden',
          border: star ? '1px solid #FFD70099' : theme.border.tertiary,
          padding: 3,
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: theme.radius.circle,
          }}
          src={`${process.env.REACT_APP_API_UPLOADS}${
            icon ? icon : 'default.jpg'
          }`}
          alt={icon}
        />
      </div>
    </div>
  )
}
