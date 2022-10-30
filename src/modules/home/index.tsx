import React from 'react'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { BubblePull } from 'components/animation/BubblePull'
import useWeb from 'hooks/useWeb'
import useLanguage from 'hooks/useLanguage'

export const Home = () => {
  const { width } = useWeb()
  const { language } = useLanguage()
  return (
    <Layout>
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: width > 1024 ? '1fr 600px' : '1fr',
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0, 
            left: 0
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 50px',
            }}
          >
            <h1 style={{ fontWeight: 300 }}>
              {language['HOMEPAGE_TITLE']}
            </h1>
            <br />
            <p>
              {language['HOMEPAGE_DESCRIPTION']}
            </p>
          </div>
          {width > 1024 && (
            <div>
              <BubblePull />
            </div>
          )}
        </div>
      </Container>
    </Layout>
  )
}
