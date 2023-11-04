import { useState } from 'react'
import selectionFieldStyle from './SelectionField.module.css'
import { PlaceholderOption, Option } from './Option'

function SelectionField({ id, label, placeholder, options }) {
    const [ selectColor, setSelectColor ] = useState({ color: "var(--placeholder-color)" })

    const handleSelectionChange = (event) => {
        const select = event.target
        setSelectColor({ color: select.value == '' ? 'var(--placeholder-color' : 'black'})
    }

    return (
        <div className={ selectionFieldStyle.SelectionField }>
            <label htmlFor={ id }>{ label }</label>
            <select id={ id } className={ selectionFieldStyle.Selection } name={ id } style={ selectColor } 
                onChange={ handleSelectionChange }>
                <PlaceholderOption placeholder={ placeholder } />
                { options.map((option, index) => 
                    <Option key={ index + 1 } value={ option.value } description={ option.description } />
                )}
            </select>
        </div>
    )
}

export default SelectionField