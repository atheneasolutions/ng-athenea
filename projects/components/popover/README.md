
# Popover ionic

Paquet d'athenea per generar un popover de ionic angular

## Funcions

#### Generar popover 

```
presentPopover(e: Event, items: Items[]): string
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `e`       | `Event`  | **Required**. $event del trigger. |
| `items`   | `Items[]`| **Required**. Items que es mostrarán al popover |

```
Items {
  text: string,     // Text que es mostrará
  icon?: string,    // Opcional: Icona ionic
  if?: boolean,     // Opcional: Condicional si s'ha de mostrar o no
  role: string      // Rol que retornará la funció un cop seleccionada una opció
};
```

Retorna el rol del item que s'ha seleccionat.
## Authors

- [@llucg-athenea](https://www.github.com/llucg-athenea)

