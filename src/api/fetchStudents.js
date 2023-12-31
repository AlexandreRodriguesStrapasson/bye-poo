export const fetchOneStudent = async (id) => {
    try {
        const students = await fetchAllStudents()
        const student = students.data.filter(s => s.id === id)[0]

        return { status: 200, data: student }
    }
    catch (error) {
        return { status: 500, cause: 'Esqueceram de ligar o servidor!' }
    }
}

export const fetchAllStudents = async () => {
    try {
        const response = await fetch('http://localhost:3500/student')
        const students = await response.json()
        const reasons = await fetchReasons()
        
        for (let i = 0; i < students.length; i++) {
            const student = students[i]
            const reason = reasons.data.filter(r => r.reason === student.reason)[0]
            student.reason = reason
            students[i] = student
        }

        return { status: 200, data: students }
    }
    catch (error) {
        return { status: 500, cause: 'Esqueceram de ligar o servidor!' }
    }
}

export const fetchReasons = async () => {
    try {
        const response = await fetch('http://localhost:3500/reason')
        const reasons = await response.json()
        return { status: 200, data: reasons }
    }
    catch (error) {
        return { status: 500, cause: 'Esqueceram de ligar o servidor!' }
    }
}

export const fetchAnswerToReason = async (reason) => {
    if (!existsReason(reason))
        return { status: 200, data: { type: "text", message: "Pois saiba que voce fod@! Nada pode te parar, nem mesmo POO! Forças!" } }

    try {
        const response = await fetchReasons()
        
        if (response.status >= 400)
            return response

        const answer = response.data.filter(r => r.reason === reason)[0].answer

        return { status: 200, data:  answer }
    }
    catch (error) {
        return { status: 500, cause: 'Esqueceram de ligar o servidor!' }
    }
}

export const postStudent = async (student) => {
    const notification = validateStudent(student)

    if (await existsStudent(student.id))
        return { status: 400, cause: `Já existe um desistente com o id ${student.id}` }
    if (notification)
        return { status: 400, cause: notification }

    try {
        const response = await fetch('http://localhost:3500/student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        })
        return { status: 201 }
    }
    catch (error) {
        return { status: 500, cause: 'Esqueceram de ligar o servidor.' }
    }
}

export const putStudent = async (student) => {
    if (!(await existsStudent(student.id)))
        return { status: 404, cause: `Não existe um desistente com id ${student.id}` }
    
    const notification = validateStudent(student)

    if (notification)
        return { status: 400, cause: notification }

    try {
        await fetch(`http://localhost:3500/student/${student.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        })
        return { status: 200 }
    }
    catch (error) {
        return { status: 500, cause: 'Esqueceram de ligar o servidor!' }
    }
}

export const deleteStudent = async (id) => {
    if (!(await existsStudent(id))){
        return { status: 404, cause: `Não existe um desistente com id ${id}` }}

    try {
        await fetch(`http://localhost:3500/student/${id}`, {
            method: 'DELETE'
        })
        window.location.reload()
        return { status: 200 }
    }
    catch (error) {
        return { status: 500, cause: 'Esqueceram de ligar o servidor!' }
    }
}

const validateStudent = (student) => {
    let notification = ''

    if (!student.name)
        notification += 'O nome do estudante deve ser fornecido. '
    if (!student.id)
        notification += 'O id do estudante deve ser fornecido. '
    if (!student.reason)
        notification += 'O motivo da desistencia deve ser fornecido.'

    return notification
}

export const existsStudent = async (id) => {
    const student = (await fetchOneStudent(id)).data
    return student !== undefined
}

export const existsReason = (reason) => {
    return true
}
