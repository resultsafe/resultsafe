export interface TypeDescriptor {
  category: 'interface' | 'type' | 'class' | 'enum';
  name: string;
  context?: string;
  isAbstract?: boolean;
  pattern?: 'builder' | 'factory' | 'error' | 'exception';
}
