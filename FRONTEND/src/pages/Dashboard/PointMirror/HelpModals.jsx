import React from 'react';
import Modal from '../../../components/Modal';
import { FiHelpCircle as Help } from 'react-icons/fi';


export function LearnMore({ close }) {
  return (
    <Modal close={close}>
      <h4>Sobre o Espelho de Ponto</h4>
      <p>No Espelho de Ponto, será gerado um relatório em duas partes. </p>
      <p>
        Uma delas será o relatório de apoio, contendo todas as marcações
        geradas no aplicativo. Esse relátório servirá de apoio para o
        colaborador fazer suas anotações no modelo e assinar.
      </p><p>
        A outra parte é o Modelo para Assinartura,  que por sua vez, é uma página modelo onde o funcionário
        fará suas anotações de ponto <strong>de próprio punho</strong>, utilizando ou
        não o relatório de apoio.
      </p><p>
        De acordo com a legislação vigente, <strong>sempre é o próprio funcionário</strong> deve fazer
        suas anotações no espelho de ponto e assiná-lo.
      </p>
      <p>Clique no <Help /> ao lado de cada item para ver informações de ajuda.</p>
    </Modal>
  );
}



export function TraditionalPoint({ close }) {
  return (
    <Modal close={close}>
      <h4>Ponto Tradicional</h4>
      <p>
        Este é o modelo que todos conhecem, onde o funcionário anota
        todos os seus horários e dias trabalhados.
      </p>
    </Modal>
  )
}



export function ExceptionPoint({ close }) {
  return (
    <Modal close={close}>
      <h4>Ponto por Exceção</h4>
      <p>
        O chamado "Ponto Por Exceção" é um tipo de anotação de ponto onde só são anotadas
        as marcações que são exceções, ou seja, que fogem do padrão. Ele é autorizado no <strong>§4º do Art. 74 da CLT.</strong>
      </p>
      <p>
        <strong>Por exemplo: </strong><br />
        <em>Se um funcionário trabalha de segunda a sexta das 08h às 18h, ele só
        precisa anotar os dias em que ele não cumpriu este horário.</em>
      </p>
      <p>
        <em>Se algum dia ele faltar, chegar atrasado, sair mais cedo ou trabalhar no sábado,
        ele deve anotar. Caso cumpra o horário de contrato normalmente, não é preciso anotar.</em>
      </p>
      <p>O que deve ser anotado nesse tipo de ponto?</p>
      <p>
        <ul>
          <li>Faltas</li>
          <li>Horas Extras</li>
          <li>Trabalho em dias de folga</li>
          <li>Entradas com atraso</li>
          <li>Saída mais cedo</li>
          <li>Horário de intervalo diminuído ou aumentado</li>
        </ul>
      </p>
    </Modal>
  );
}



export function GenerateModel({ close }) {
  return (
    <Modal close={close}>
      <h4>Gerar Modelo</h4>
      <p>Caso marque essa opção, será gerado um Modelo para Assinatura junto com o espelho de ponto.</p>
      <p>É nesse modelo que o colaborador deve preencher à mão e assinar seus horários.</p>
      <p>Ele pode se basear ou não no espelho de ponto, porém o funcionário deve fazer suas próprias anotações.</p>
    </Modal>
  );
}




export function SameSheet({ close }) {
  return (
    <Modal close={close}>
      <h4>Espelho e Modelo Na Mesma Folha</h4>
      <p>
        Caso marque essa opção, o sistema tentará gerar o Espelho de Ponto e o Modelo para Assinatura
        na mesma folha de ofício se houver espaço.
      </p>
      <p>Caso contrário cada relatório será gerado em uma página diferente.</p>
    </Modal>
  );
}



export function ShowBreaks({ close }) {
  return (
    <Modal close={close}>
      <h4>Pré-marcar Intervalos</h4>
      <p>
        Com essa opção os intervalos de almoço já virão impressos no Modelo para Assinatura
        do funcionário. Caso contrário, ele deve preencher os intervalos manualmente.
      </p>
      <p>O §2º do Art. 74 da CLT. autoriza a pré-marcação de intervalos.</p>
    </Modal>
  );
}



export function ShowExtras({ close }) {
  return (
    <Modal close={close}>
      <h4>Mostrar Horas Extras</h4>
      <p>Caso desmarque essa opção, todos os dias serão mostrados com o horário normal.</p>
      <p>Somente use essa opção com caráter informativo!</p>
    </Modal>
  );
}



export function ShowMisses({ close }) {
  return (
    <Modal close={close}>
      <h4>Mostrar Faltas</h4>
      <p>Caso desmarque essa opção, todas as faltas serão mostradas como dias trabalhados normais.</p>
      <p>Somente use essa opção com caráter informativo!</p>
    </Modal>
  );
}



export function ShowDayoffs({ close }) {
  return (
    <Modal close={close}>
      <h4>Mostrar Folgas Trabalhadas</h4>
      <p>Caso desmarque essa opção, todos os dias de folgas trabalhados serão ocultados.</p>
      <p>Somente use essa opção com caráter informativo!</p>
    </Modal>
  );
}
