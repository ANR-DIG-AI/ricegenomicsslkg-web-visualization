import React , { Component } from 'react';
import Highlighter from "react-highlight-words";

class TextHighlight extends Component {
    render (){
        return(
            <Highlighter
                highlightClassName="YourHighlightClass"
                searchWords={["and", "or", "the"]}
                autoEscape={true}
                textToHighlight="Abstract An enhanced polymerase chain reaction (PCR) assay to detect the coronavirus associated with severe acute respiratory syndrome (SARS-CoV) was developed in which a target gene pre-amplification step preceded TaqMan real-time fluorescent PCR.
                Clinical samples were collected from 120 patients diagnosed as suspected or probable SARS cases and analyzed by conventional PCR followed by agarose gel electrophoresis, conventional TaqMan real-time PCR, and our enhanced TaqMan real-time PCR assays.
                An amplicon of the size expected from SARS-CoV was obtained from 28/120 samples using the enhanced real-time PCR method.
                Conventional PCR and real-time PCR alone identified fewer SARS-CoV positive cases. Results were confirmed by viral culture in 3/28 cases. The limit of detection of the enhanced real-time PCR method was 102-fold higher than the standard real-time PCR assay and 107-fold higher than conventional PCR methods.
                The increased sensitivity of the assay may help control the spread of the disease during future SARS outbreaks."
         />
        )
    }
}

export default TextHighlight;

