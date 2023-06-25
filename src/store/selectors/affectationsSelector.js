export const affectationsSeletor = ({ affectations }) => affectations.affectations
export const affectationsLoadingSelector = ({ affectations }) => affectations.loading
export const completedAffectationSelector = ({ affectations }) => affectations.affectations.filter(affectation => affectation.ActiviteFinie == true)
export const uncompletedAffectationSelector = ({ affectations }) => affectations.affectations.filter(affectation => affectation.ActiviteFinie == false)