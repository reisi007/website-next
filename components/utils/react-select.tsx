import {
  GroupBase, OnChangeValue, OptionsOrGroups, Props,
} from 'react-select';
import { useCallback, useState } from 'react';
import Select from 'react-select/base';

export function useSelect<T extends { search:string }, IsMulti extends boolean>(isMulti:IsMulti, initialSelected: OnChangeValue<T, IsMulti>, moreProps?: MoreProps<T, IsMulti>) {
  const [curSelected, setCurSelected] = useState(initialSelected);
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<OptionsOrGroups<T, GroupBase<T>>>([]);
  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const select = (
    <Select<T, IsMulti>
      menuIsOpen={isOpen}
      onMenuClose={closeMenu}
      onChange={setCurSelected}
      onMenuOpen={openMenu}
      value={curSelected}
      inputValue={search}
      onInputChange={setSearch}
      options={options}
      isMulti={isMulti}
      filterOption={(option, input) => option.data.search?.includes(input.toLowerCase())}
      {...moreProps}
    />
  );
  return {
    select,
    curSelected,
    setCurSelected,
    setOptions,
  };
}

export type MoreProps<Option, IsMulti extends boolean> = Omit<
Props<Option, IsMulti, GroupBase<Option>>,
'menuIsOpen' | 'onMenuClose' | 'onChange' | 'onMenuOpen' | 'value' | 'inputValue' | 'onInputChange' | 'options' | 'isMulti'
>;
