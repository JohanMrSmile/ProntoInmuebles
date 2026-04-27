import { Flex, Box, Stack, Text, Badge } from '@sanity/ui'
import type { PreviewProps } from 'sanity'

interface CustomPreviewProps extends PreviewProps {
  price?: string
  transactionType?: string
  propertyType?: string
  beds?: number
  baths?: number
}

export function PropertyPreview(props: CustomPreviewProps) {
  const { title, subtitle, media, price, transactionType, propertyType, beds, baths } = props

  return (
    <Flex align="center" gap={3} padding={2} style={{ width: '100%', minWidth: '300px' }}>
      {/* Media Thumbnail */}
      <Box style={{ width: '70px', height: '70px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {media ? (
          <div style={{ transform: 'scale(2.2)' }}>{media as React.ReactNode}</div>
        ) : (
          <Text size={1} muted>No Img</Text>
        )}
      </Box>

      {/* Info Content */}
      <Stack space={2} flex={1} style={{ overflow: 'hidden' }}>
        <Flex justify="space-between" align="center">
          <Text size={1} weight="semibold" style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>
            {propertyType || 'Sin Tipo'}
          </Text>
          {transactionType && (
            <Badge tone={transactionType === 'Venta' ? 'primary' : 'positive'} mode="outline" fontSize={0}>
              {transactionType}
            </Badge>
          )}
        </Flex>
        
        <Text size={2} weight="bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
          {(title as string) || 'Sin Título'}
        </Text>
        
        <Flex justify="space-between" align="flex-end" wrap="wrap" gap={2}>
          <Stack space={2}>
            <Text size={1} muted style={{ fontSize: '11px' }}>📍 {(subtitle as string) || 'Sin Ubicación'}</Text>
            <Text size={1} muted style={{ fontSize: '11px' }}>🛌 {beds || 0} Hab • 🛀 {baths || 0} Baños</Text>
          </Stack>
          <Text size={2} weight="bold" style={{ color: '#d97706', fontSize: '13px' }}>
            {price || 'Sin Precio'}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  )
}
