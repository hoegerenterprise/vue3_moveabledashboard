/**
 * Base interface for a Dashboard Card
 */
export interface IDashboardCard {
  id: string;
  type?: string;
  header?: string;
  hideHeader?: boolean;
  useHeader?: boolean;
  headerColor?: string;
  width?: number;
  x?: number;
  y?: number;
  z?: number;
  rotate?: number;
}

/**
 * Interface for Moveable Dashboard Container
 */
export interface IMoveableDashboardContainer extends IDashboardCard {
  x: number;
  y: number;
  rotate: number;
}

/**
 * Interface for Dashboard configuration
 */
export interface IMoveableDashboard {
  id: string;
  name: string;
  cards: IMoveableDashboardContainer[];
}

/**
 * Card position and transform information
 */
export interface ICardTransform {
  x: number;
  y: number;
  width: number;
  rotate: number;
}

/**
 * Events emitted by the dashboard components
 */
export interface IDashboardEvents {
  cardMoved: (cardId: string, position: { x: number; y: number }) => void;
  cardResized: (cardId: string, size: { width: number; height: number }) => void;
  cardRotated: (cardId: string, rotation: number) => void;
  cardSelected: (cardId: string) => void;
  cardDeselected: () => void;
}
