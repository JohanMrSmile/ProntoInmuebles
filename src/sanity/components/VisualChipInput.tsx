import { useCallback } from 'react'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'
import { Flex, Card, Text } from '@sanity/ui'

export function VisualChipInput(props: StringInputProps) {
  const { value, onChange, schemaType } = props
  
  // Extraer la lista de opciones del esquema
  const options = (schemaType?.options as any)?.list || []

  const handleClick = useCallback(
    (optionValue: string) => {
      // Si ya está seleccionado y lo clickean, lo desmarcamos
      if (value === optionValue) {
        onChange(unset())
      } else {
        // Seleccionamos el nuevo valor
        onChange(set(optionValue))
      }
    },
    [value, onChange]
  )

  return (
    <Flex wrap="wrap" gap={2} marginTop={2}>
      {options.map((option: any) => {
        const optionValue = option.value || option
        const optionTitle = option.title || option
        const isSelected = value === optionValue

        return (
          <Card
            key={optionValue}
            as="button"
            type="button"
            onClick={() => handleClick(optionValue)}
            padding={3}
            radius={3}
            shadow={isSelected ? 2 : 1}
            style={{
              cursor: 'pointer',
              backgroundColor: isSelected ? '#1a202c' : '#ffffff',
              border: isSelected ? '2px solid #1a202c' : '1px solid #cbd5e1',
              transition: 'all 0.15s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px'
            }}
          >
            <Text
              weight="bold"
              size={2}
              style={{
                color: isSelected ? '#ffffff' : '#475569',
              }}
            >
              {optionTitle}
            </Text>
          </Card>
        )
      })}
    </Flex>
  )
}
