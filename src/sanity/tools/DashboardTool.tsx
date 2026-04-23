'use client'

import { useEffect, useState } from 'react'
import { Card, Container, Grid, Heading, Stack, Text, Box, Flex, Badge, Button } from '@sanity/ui'
import { useClient } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export function DashboardTool() {
  const client = useClient({ apiVersion: '2026-04-23' })
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const query = `{
        "total": count(*[_type == "property"]),
        "venta": count(*[_type == "property" && transactionType == "Venta"]),
        "arriendo": count(*[_type == "property" && transactionType == "Arriendo"]),
        "recent": *[_type == "property"] | order(_createdAt desc)[0...6] {
          _id,
          title,
          "imageUrl": image.asset->url,
          price,
          transactionType,
          propertyType
        }
      }`
      const result = await client.fetch(query)
      setData(result)
      setLoading(false)
    }
    fetchData()
  }, [client])

  if (loading) {
    return (
      <Flex align="center" justify="center" height="fill" style={{ minHeight: '600px' }}>
        <Text muted>Cargando panel de resumen...</Text>
      </Flex>
    )
  }

  return (
    <Container width={3} padding={5} style={{ maxWidth: '1200px' }}>
      <Stack space={5}>
        <Flex justify="space-between" align="center">
          <Stack space={3}>
            <Heading as="h1" size={5}>📊 Overview del Negocio</Heading>
            <Text muted size={2}>Bienvenido a Pronto Inmuebles. Aquí tienes el resumen de tu portafolio.</Text>
          </Stack>
          
          <a href="/studio/intent/create/type=property" style={{ textDecoration: 'none' }}>
            <Button text="Crear Nuevo Inmueble" icon={HomeIcon} tone="primary" mode="default" padding={3} style={{ cursor: 'pointer' }} />
          </a>
        </Flex>

        <Grid columns={[1, 1, 3]} gap={4}>
          <Card padding={4} radius={3} shadow={1} tone="transparent" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <Stack space={3}>
              <Text muted size={2} weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Inmuebles</Text>
              <Heading size={5}>{data?.total || 0}</Heading>
            </Stack>
          </Card>
          <Card padding={4} radius={3} shadow={1} tone="primary" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <Stack space={3}>
              <Text muted size={2} weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0369a1' }}>En Venta</Text>
              <Heading size={5} style={{ color: '#0369a1' }}>{data?.venta || 0}</Heading>
            </Stack>
          </Card>
          <Card padding={4} radius={3} shadow={1} tone="positive" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <Stack space={3}>
              <Text muted size={2} weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: '#15803d' }}>En Arriendo</Text>
              <Heading size={5} style={{ color: '#15803d' }}>{data?.arriendo || 0}</Heading>
            </Stack>
          </Card>
        </Grid>

        <Box marginTop={5}>
          <Heading as="h2" size={3} style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
            Últimos Inmuebles Añadidos
          </Heading>
        </Box>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animated-card {
              transition: all 0.2s ease-in-out !important;
            }
            .animated-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
            }
          `}
        </style>
        <Grid columns={[1, 2, 3]} gap={4}>
          {data?.recent?.map((prop: any, index: number) => (
            <a key={prop._id} href={`/studio/intent/edit/id=${prop._id};type=property`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card 
                radius={3} 
                shadow={1} 
                className="animated-card"
                overflow="hidden" 
                style={{ 
                  cursor: 'pointer', 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <Box style={{ height: '200px', backgroundColor: '#f1f5f9', backgroundImage: prop.imageUrl ? `url(${prop.imageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <Box padding={4}>
                  <Stack space={3}>
                    <Flex justify="space-between" align="center">
                      <Badge mode="outline" tone={prop.transactionType === 'Venta' ? 'primary' : 'positive'}>
                        {prop.transactionType || 'N/A'}
                      </Badge>
                      <Text size={1} muted weight="medium" style={{ textTransform: 'uppercase' }}>{prop.propertyType}</Text>
                    </Flex>
                    <Text size={2} weight="bold" style={{ lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prop.title || 'Sin Título'}
                    </Text>
                    <Text size={2} weight="semibold" style={{ color: '#d97706' }}>
                      {prop.price || 'Sin Precio'}
                    </Text>
                  </Stack>
                </Box>
              </Card>
            </a>
          ))}
          {data?.recent?.length === 0 && (
            <Text muted>No hay inmuebles recientes.</Text>
          )}
        </Grid>
      </Stack>
    </Container>
  )
}
