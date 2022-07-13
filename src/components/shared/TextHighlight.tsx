export const TextHighlight = ({ text, color }: any) => {
  return (
    <div
      style={{
        padding: '0 11px',
        height: 27,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        borderRadius: 5
      }}
    >
      {text}
    </div>
  )
}
