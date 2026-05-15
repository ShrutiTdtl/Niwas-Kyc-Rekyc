from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.workflow.models import WorkflowCase
@api_view(['GET'])
def queue(request):
    return Response({'open':WorkflowCase.objects.filter(status='OPEN').count(),'edd':WorkflowCase.objects.filter(status='EDD').count(),'deficiency':WorkflowCase.objects.filter(status='DEFICIENCY').count()})
